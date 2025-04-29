const express = require("express");
const router = express.Router();
const { AIProjectsClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

const client = AIProjectsClient.fromConnectionString(
  process.env.AZURE_PROJECTS_CONNECTION_STRING,
  new DefaultAzureCredential()
);

router.post("/create-proposal", async (req, res) => {
  try {
    const { question } = req.body;
    const agentId = process.env.PROPOSAL_AGENT_ID;

    if (!question || !agentId) {
      return res.status(400).json({ error: "Missing question or agentId" });
    }

    const thread = await client.agents.createThread();
    const threadId = thread.id;

    await client.agents.createMessage(threadId, {
      role: "user",
      content: question,
    });

    const run = await client.agents.createRun(threadId, agentId);

    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await client.agents.getRun(threadId, run.id);
    } while (runStatus.status !== "completed" && runStatus.status !== "failed");

    if (runStatus.status === "failed") {
      return res.status(500).json({ error: "Agent run failed" });
    }

    const messages = await client.agents.listMessages(threadId);

    const assistantMessage = messages?.data.find(
      (msg) => msg.role === "assistant"
    );

    res.json({
      threadId,
      response: assistantMessage?.content ?? "No response from agent",
    });
  } catch (error) {
    console.error("❌ Error in /create-proposal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
