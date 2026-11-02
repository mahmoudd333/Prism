const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["Customer", "Prism", "Admin"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    sources: [
      {
        title: String,
        category: String,
        knowledgeEntryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "KnowledgeEntry",
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerLabel: {
      type: String,
      default: "Guest",
    },
    status: {
      type: String,
      enum: ["Active", "Needs support", "Resolved"],
      default: "Active",
      index: true,
    },
    handoffRequested: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);