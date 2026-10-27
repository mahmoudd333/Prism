const mongoose = require("mongoose");

const knowledgeEntrySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["FAQ", "Policy", "Product", "Document"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000000,
    },
    price: {
      type: String,
      default: "",
    },
    sourceType: {
      type: String,
      enum: ["manual", "file"],
      default: "manual",
    },
    fileName: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KnowledgeEntry", knowledgeEntrySchema);
