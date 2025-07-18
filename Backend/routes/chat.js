import express from "express";
const router = express.Router();

import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

// ✅ Create or Update Chat Thread
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId?.trim() || !message?.trim()) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.slice(0, 50), // max 50 chars
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        if (!assistantReply || typeof assistantReply !== "string") {
            return res.status(502).json({ error: "Failed to get response from OpenAI" });
        }

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Something went wrong while processing chat" });
    }
});

// ✅ Get All Threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 }); // latest first
        res.json(threads);
    } catch (err) {
        console.error("Error fetching threads:", err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// ✅ Get One Thread by ID
router.get("/thread/:id", async (req, res) => {
    try {
        const thread = await Thread.findOne({ threadId: req.params.id });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread);
    } catch (err) {
        console.error("Error fetching thread:", err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});

// ✅ Delete a Thread
router.delete("/thread/:id", async (req, res) => {
    try {
        await Thread.deleteOne({ threadId: req.params.id });
        res.json({ message: "Thread deleted successfully" });
    } catch (err) {
        console.error("Error deleting thread:", err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

export default router;
