const mongoose = require("mongoose");

const questionEmbeddingSchema = new mongoose.Schema(
  {
    normalizedQuestion: {
      type: String,
      required: true,
      unique: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "QuestionEmbedding",
  questionEmbeddingSchema
);