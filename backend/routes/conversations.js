const express = require("express");
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

router.get("/:conversationId/messages", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { after } = req.query;

    const conversation = await Conversation.findOne({ conversationId });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    let messages = conversation.messages;

    if (after) {
      if (!mongoose.Types.ObjectId.isValid(after)) {
        return res.status(400).json({ message: "Invalid message cursor." });
      }

       messages = messages.filter(
       (message) => message._id.toString().localeCompare(after) > 0
      );
    }

    return res.json({
      messages: messages.map((message) => ({
        id: message._id.toString(),
        sender: message.sender,
        text: message.text,
        sources: message.sources || [],
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    console.error("Customer message polling error:", error);
    return res.status(500).json({ message: "Unable to retrieve messages." });
  }
});

router.use(requireAdmin);

router.get("/unanswered", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      status: "Needs support",
    })
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ conversations });
  } catch (error) {
    console.error("Unanswered conversations error:", error);
    return res.status(500).json({ message: "Unable to load support requests." });
  }
});

router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ conversations });
  } catch (error) {
    console.error("Conversation list error:", error);
    return res.status(500).json({ message: "Unable to load conversations." });
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      conversationId: req.params.conversationId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    return res.json({ conversation });
  } catch (error) {
    console.error("Conversation detail error:", error);
    return res.status(500).json({ message: "Unable to load conversation." });
  }
});

router.post("/:conversationId/reply", async (req, res) => {
  try {
    const text =
      typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!text) {
      return res.status(400).json({ message: "Please enter a reply." });
    }

    if (text.length > 10000) {
      return res.status(400).json({ message: "Your reply is too long." });
    }

    const conversation = await Conversation.findOne({
      conversationId: req.params.conversationId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    conversation.messages.push({
      sender: "Admin",
      text,
    });

    conversation.status = "Resolved";
    conversation.handoffRequested = false;

    await conversation.save();

    return res.json({
      message: "Reply sent.",
      conversation,
    });
  } catch (error) {
    console.error("Admin reply error:", error);
    return res.status(500).json({ message: "Unable to send reply." });
  }
});

router.patch("/:conversationId/status", async (req, res) => {
  try {
    const allowedStatuses = ["Active", "Needs support", "Resolved"];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid conversation status." });
    }

    const conversation = await Conversation.findOne({
      conversationId: req.params.conversationId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    conversation.status = status;
    conversation.handoffRequested = status === "Needs support";

    await conversation.save();

    return res.json({ conversation });
  } catch (error) {
    console.error("Conversation status update error:", error);
    return res.status(500).json({ message: "Unable to update status." });
  }
});

module.exports = router;
