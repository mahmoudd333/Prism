const { GoogleGenAI } = require("@google/genai");
const KnowledgeEntry = require("../models/KnowledgeEntry");
const KnowledgeChunk = require("../models/KnowledgeChunk");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

const EMBEDDING_DIMENSIONS = 1536;
const CHUNK_SIZE = 180;
const CHUNK_OVERLAP = 30;

function chunkText(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks = [];
  const step = CHUNK_SIZE - CHUNK_OVERLAP;

  for (let start = 0; start < words.length; start += step) {
    const chunk = words.slice(start, start + CHUNK_SIZE).join(" ");

    if (chunk) chunks.push(chunk);
    if (start + CHUNK_SIZE >= words.length) break;
  }

  return chunks;
}

async function createEmbeddings(texts, taskType = "RETRIEVAL_DOCUMENT") {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from backend/.env");
  }

  const embeddings = [];

  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);

    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: batch,
      config: {
        taskType,
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    });

    if (!response.embeddings || response.embeddings.length !== batch.length) {
      throw new Error("Gemini returned an unexpected number of embeddings.");
    }

    for (const item of response.embeddings) {
      if (!item.values || item.values.length !== EMBEDDING_DIMENSIONS) {
        throw new Error("Gemini returned an embedding with an unexpected dimension.");
      }

      embeddings.push(item.values);
    }
  }

  return embeddings;
}

async function indexKnowledgeEntry(entry) {
  const fullText = [
    `Title: ${entry.title}`,
    `Category: ${entry.category}`,
    entry.price ? `Price: ${entry.price}` : "",
    entry.content,
  ]
    .filter(Boolean)
    .join("\n");

  const chunks = chunkText(fullText);

  if (chunks.length === 0) {
    throw new Error("This knowledge entry has no text to index.");
  }

  const embeddings = await createEmbeddings(
    chunks,
    "RETRIEVAL_DOCUMENT"
  );

  const documents = chunks.map((content, index) => ({
    knowledgeEntryId: entry._id,
    uploadedBy: entry.uploadedBy,
    title: entry.title,
    category: entry.category,
    content,
    chunkIndex: index,
    embedding: embeddings[index],
  }));

  await KnowledgeChunk.deleteMany({
    knowledgeEntryId: entry._id,
  });

  await KnowledgeChunk.insertMany(documents);

  return chunks.length;
}

async function removeKnowledgeEntry(entryId) {
  await KnowledgeChunk.deleteMany({
    knowledgeEntryId: entryId,
  });
}

async function reindexAllKnowledge() {
  const entries = await KnowledgeEntry.find();

  for (const entry of entries) {
    await indexKnowledgeEntry(entry);
    console.log(`Indexed: ${entry.title}`);
  }

  return entries.length;
}

module.exports = {
  createEmbeddings,
  indexKnowledgeEntry,
  removeKnowledgeEntry,
  reindexAllKnowledge,
};
