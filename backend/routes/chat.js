const express = require("express");
const KnowledgeChunk = require("../models/KnowledgeChunk");
const { createEmbeddings } = require("../services/ragService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const question =
      typeof req.body.question === "string"
        ? req.body.question.trim()
        : "";

    if (!question) {
      return res.status(400).json({
        message: "Please enter a question.",
      });
    }

    if (question.length > 2000) {
      return res.status(400).json({
        message: "Your question is too long.",
      });
    }

    const [queryEmbedding] = await createEmbeddings(
      [question],
      "RETRIEVAL_QUERY"
    );

    const matches = await KnowledgeChunk.aggregate([
      {
        $vectorSearch: {
          index: "prism_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $project: {
          title: 1,
          category: 1,
          content: 1,
          knowledgeEntryId: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);
         
    return res.json({
      question,
      results: matches.map((match) => ({
        title: match.title,
        category: match.category,
        content: match.content,
        score: match.score,
        knowledgeEntryId: match.knowledgeEntryId,
      })),
      foundContext: matches.length > 0,
    });
  } catch (error) {
    console.error("Prism retrieval error:", error.message);

    return res.status(500).json({
      message: "Prism couldn't search its knowledge base. Please try again.",
    });
  }
});

module.exports = router;
