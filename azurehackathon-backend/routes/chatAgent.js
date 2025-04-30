const express = require("express");
const router = express.Router();
const {
  AIProjectsClient,
  MessageStreamEvent,
  RunStreamEvent,
  ErrorEvent,
  DoneEvent,
} = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

const client = AIProjectsClient.fromConnectionString(
  process.env.AZURE_PROJECTS_CONNECTION_STRING,
  new DefaultAzureCredential()
);

router.post("/chat", async (req, res) => {
  try {
    const { question, threadId: existingThreadId } = req.body;
    const agentId = process.env.AGENT_ID;

    if (!question || !agentId) {
      return res.status(400).json({ error: "Missing question or agentId" });
    }

    let threadId = existingThreadId;

    if (!threadId) {
      const thread = await client.agents.createThread();
      threadId = thread.id;
      console.log("Created new thread with ID:", threadId);
    }

    await client.agents.createMessage(threadId, {
      role: "user",
      content: question,
    });

    const streamEventMessages = await client.agents
      .createRun(threadId, agentId)
      .stream();

    let fullMessage = "";
    const messages = [];
    let completed = false;

    for await (const eventMessage of streamEventMessages) {
      switch (eventMessage.event) {
        case RunStreamEvent.ThreadRunCreated:
          console.log(`ThreadRun status: ${eventMessage.data.status}`);
          break;

        case MessageStreamEvent.ThreadMessageDelta:
          const messageDelta = eventMessage.data;
          messageDelta.delta.content.forEach((contentPart) => {
            if (contentPart.type === "text") {
              const textValue = contentPart.text?.value || "No text";
              console.log(`Text delta received: ${textValue}`);
              fullMessage += textValue;
            }
          });
          break;

        case RunStreamEvent.ThreadRunCompleted:
          console.log("✅ Thread Run Completed");
          messages.push(fullMessage);
          completed = true;
          break;

        case ErrorEvent.Error:
          console.error(`❌ Error event: ${eventMessage.data}`);
          break;

        case DoneEvent.Done:
          console.log("✔️ Stream completed.");
          if (completed) {
            return res.json({ threadId, messages });
          } else {
            return res.status(500).json({
              error: "Stream ended without ThreadRunCompleted",
            });
          }
      }
    }
  } catch (error) {
    console.error("❌ Error in /chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;
