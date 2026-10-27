const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");
const KnowledgeEntry = require("../models/KnowledgeEntry");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

router.use(requireAdmin);

router.get("/", async (req, res) => {
  try {
    const entries = await KnowledgeEntry.find({
      uploadedBy: req.adminId,
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    console.error("Load knowledge base error:", error.message);
    res.status(500).json({ message: "Unable to load knowledge entries." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category, title, content, price } = req.body;

    if (!["FAQ", "Policy", "Product"].includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    if (title.trim().length > 300 || content.trim().length > 2000000) {
      return res.status(400).json({ message: "Entry is too long." });
    }

    if (
      category === "Product" &&
      (typeof price !== "string" || !price.trim())
    ) {
      return res.status(400).json({
        message: "Product price is required.",
      });
    }

    const entry = await KnowledgeEntry.create({
      category,
      title: title.trim(),
      content: content.trim(),
      price: category === "Product" ? price.trim() : "",
      sourceType: "manual",
      uploadedBy: req.adminId,
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("Save knowledge entry error:", error.message);
    res.status(500).json({ message: "Unable to save this entry." });
  }
});

router.post("/files", (req, res, next) => {
  upload.array("files", 5)(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.code === "LIMIT_FILE_SIZE"
          ? "Each file must be 5 MB or smaller."
          : "Unable to receive these files. Select up to 5 files, each 5 MB or smaller.",
      });
    }

    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Select at least one file." });
    }

    const createdEntries = [];

    for (const file of req.files) {
      const extension = path.extname(file.originalname).toLowerCase();
      let content;

      if (extension === ".txt") {
        content = file.buffer.toString("utf8");
      } else if (extension === ".pdf") {
        const parsed = await pdfParse(file.buffer);
        content = parsed.text;
      } else if (extension === ".docx") {
        const parsed = await mammoth.extractRawText({
          buffer: file.buffer,
        });
        content = parsed.value;
      } else {
        return res.status(400).json({
          message: `${file.originalname}: only PDF, TXT, and DOCX files are supported.`,
        });
      }

      content = content.trim();

      if (!content) {
        return res.status(400).json({
          message: `${file.originalname} contains no extractable text.`,
        });
      }

      if (content.length > 2000000) {
        return res.status(400).json({
          message: `${file.originalname} contains too much text.`,
        });
      }

      const entry = await KnowledgeEntry.create({
        category: "Document",
        title: file.originalname,
        content,
        sourceType: "file",
        fileName: file.originalname,
        uploadedBy: req.adminId,
      });

      createdEntries.push(entry);
    }

    res.status(201).json({
      message: `${createdEntries.length} document(s) uploaded successfully.`,
      entries: createdEntries,
    });
  } catch (error) {
    console.error("Document upload error:", error.message);
    res.status(500).json({
      message: "Unable to process the documents. Check their format and try again.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await KnowledgeEntry.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.adminId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Knowledge entry not found.",
      });
    }

    res.json({ message: "Knowledge entry deleted successfully." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid entry ID." });
    }

    console.error("Delete knowledge entry error:", error.message);
    res.status(500).json({ message: "Unable to delete this entry." });
  }
});

module.exports = router;
