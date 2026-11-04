const express = require("express");
const Conversation = require("../models/Conversation");
const QuestionEmbedding = require("../models/QuestionEmbedding");
const requireAdmin = require("../middleware/auth");
const { createEmbeddings } = require("../services/ragService");

const router = express.Router();

const MIN_QUESTION_COUNT = 2;
const SIMILARITY_THRESHOLD = 0.88;

function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,'"]/g, "")
    .replace(/\s+/g, " ");
}

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (!magnitudeA || !magnitudeB) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function getQuestionEmbeddings(questions) {
  const cached = await QuestionEmbedding.find({
    normalizedQuestion: { $in: questions },
  }).lean();

  const embeddingMap = new Map(
    cached.map((item) => [
      item.normalizedQuestion,
      item.embedding,
    ])
  );

  const missingQuestions = questions.filter(
    (question) => !embeddingMap.has(question)
  );

  if (missingQuestions.length > 0) {
    const newEmbeddings = await createEmbeddings(
      missingQuestions,
      "SEMANTIC_SIMILARITY"
    );

    const documents = missingQuestions.map((question, index) => ({
      normalizedQuestion: question,
      embedding: newEmbeddings[index],
    }));

    await QuestionEmbedding.insertMany(documents, {
      ordered: false,
    }).catch(async (error) => {
      if (error.code !== 11000) throw error;
    });

    missingQuestions.forEach((question, index) => {
      embeddingMap.set(question, newEmbeddings[index]);
    });
  }

  return embeddingMap;
}

router.use(requireAdmin);

router.get("/common-questions", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .select("messages")
      .lean();

    const questionGroups = {};

    conversations.forEach((conversation) => {
      (conversation.messages || []).forEach((message) => {
        if (message.sender !== "Customer") return;

        const originalQuestion = message.text.trim();

        if (!originalQuestion) return;

        const normalized = normalizeQuestion(originalQuestion);

        if (!normalized) return;

        if (!questionGroups[normalized]) {
          questionGroups[normalized] = {
            normalized,
            question: originalQuestion,
            count: 0,
          };
        }

        questionGroups[normalized].count += 1;
      });
    });

    const uniqueQuestions = Object.keys(questionGroups);

    if (uniqueQuestions.length === 0) {
      return res.json({ questions: [] });
    }

    const embeddingMap = await getQuestionEmbeddings(uniqueQuestions);

    const questions = uniqueQuestions.map((normalized) => ({
      ...questionGroups[normalized],
      embedding: embeddingMap.get(normalized),
    }));

    questions.sort((a, b) => b.count - a.count);

    const groups = [];

    for (const question of questions) {
      if (!question.embedding) continue;

      let bestGroup = null;
      let bestSimilarity = 0;

      for (const group of groups) {
        for (const member of group.members) {
          const similarity = cosineSimilarity(
            question.embedding,
            member.embedding
          );

          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestGroup = group;
          }
        }
      }

      if (bestGroup && bestSimilarity >= SIMILARITY_THRESHOLD) {
        bestGroup.count += question.count;
        bestGroup.members.push(question);
      } else {
        groups.push({
          question: question.question,
          count: question.count,
          members: [question],
        });
      }
    }

    const commonQuestions = groups
      .filter((group) => group.count >= MIN_QUESTION_COUNT)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ question, count }) => ({
        question,
        count,
      }));

    return res.json({ questions: commonQuestions });
  } catch (error) {
    console.error("Common questions analytics error:", error);

    return res.status(500).json({
      message: "Unable to generate common questions.",
    });
  }
});

module.exports = router;