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

    // Validasi input
    if (!question || !agentId) {
      return res.status(400).json({ error: "Missing question or agentId" });
    }

    let threadId = existingThreadId;

    // Jika threadId tidak ada, buat thread baru
    if (!threadId) {
      const thread = await client.agents.createThread();
      threadId = thread.id;
      console.log("Created new thread with ID:", threadId);
    }

    if (!threadId) {
      return res.status(400).json({ error: "Invalid threadId" });
    }

    // Kirim pesan ke thread
    await client.agents.createMessage(threadId, {
      role: "user",
      content: question,
    });

    // Menjalankan agen dengan threadId dan agentId menggunakan stream
    const streamEventMessages = await client.agents
      .createRun(threadId, agentId)
      .stream();

    let fullMessage = ""; // Variable to accumulate the full message
    const messages = [];

    // Proses stream events
    for await (const eventMessage of streamEventMessages) {
      switch (eventMessage.event) {
        case RunStreamEvent.ThreadRunCreated:
          console.log(`ThreadRun status: ${eventMessage.data.status}`);
          break;

        case MessageStreamEvent.ThreadMessageDelta:
          const messageDelta = eventMessage.data;
          messageDelta.delta.content.forEach((contentPart) => {
            if (contentPart.type === "text") {
              const textContent = contentPart;
              const textValue = textContent.text?.value || "No text";
              console.log(`Text delta received: ${textValue}`);
              fullMessage += textValue; // Concatenate the text chunks
            }
          });
          break;

        case RunStreamEvent.ThreadRunCompleted:
          console.log("Thread Run Completed");
          messages.push(fullMessage); // Once the stream is completed, add the full message to messages
          break;

        case ErrorEvent.Error:
          console.log(`An error occurred: ${eventMessage.data}`);
          break;

        case DoneEvent.Done:
          console.log("Stream completed.");
          break;
      }
    }

    // Kirim respons dengan threadId dan daftar pesan
    res.json({ threadId, messages });
  } catch (error) {
    console.error("❌ Error in /chatAgent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
