import { useEffect, useRef, useState } from "react";
import "./KnowledgeBase.css";

const categories = ["FAQ", "Policy", "Product"];
const API_URL = "http://localhost:5000";

function KnowledgeBase({ onBack }) {
  const [activeTab, setActiveTab] = useState("FAQ");
  const [entries, setEntries] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const files = entries.filter((entry) => entry.sourceType === "file");
  const manualEntries = entries.filter(
    (entry) => entry.sourceType !== "file"
  );

  async function apiRequest(url, options = {}) {
    const token = sessionStorage.getItem("prismAdminToken");

    if (!token) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      sessionStorage.removeItem("prismAdminToken");
      throw new Error("Your session has expired. Please sign in again.");
    }

    if (!response.ok) {
      throw new Error(data.message || "The request failed.");
    }

    return data;
  }

  async function loadEntries() {
    setLoading(true);

    try {
      const data = await apiRequest("/api/knowledge");
      setEntries(data);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function addEntry(event) {
    event.preventDefault();
    setNotice("");
    setSaving(true);

    const entry = activeTab === "FAQ"
      ? {
          category: "FAQ",
          title: question.trim(),
          content: answer.trim(),
        }
      : {
          category: activeTab,
          title: title.trim(),
          content: description.trim(),
          ...(activeTab === "Product" ? { price: price.trim() } : {}),
        };

    if (
      !entry.title ||
      !entry.content ||
      (activeTab === "Product" && !entry.price)
    ) {
      setNotice("Please complete all required fields.");
      setSaving(false);
      return;
    }

    try {
      const savedEntry = await apiRequest("/api/knowledge", {
        method: "POST",
        body: JSON.stringify(entry),
      });

      setEntries((previous) => [savedEntry, ...previous]);
      setQuestion("");
      setAnswer("");
      setTitle("");
      setDescription("");
      setPrice("");
      setNotice("Entry saved successfully to the database.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleFiles(event) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selected.length) return;

    setNotice("");
    setSaving(true);

    try {
      const formData = new FormData();

      selected.forEach((file) => {
        formData.append("files", file);
      });

      const data = await apiRequest("/api/knowledge/files", {
        method: "POST",
        body: formData,
      });

      setEntries((previous) => [...data.entries, ...previous]);
      setNotice(data.message);
    } catch (error) {
      setNotice(error.message);
      await loadEntries();
    } finally {
      setSaving(false);
    }
  }

  async function removeEntry(id) {
    setNotice("");

    try {
      await apiRequest(`/api/knowledge/${id}`, {
        method: "DELETE",
      });

      setEntries((previous) =>
        previous.filter((entry) => entry._id !== id)
      );
      setNotice("Entry deleted from the database.");
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <main className="knowledge-page">
      <header className="knowledge-header">
        <button
          type="button"
          className="knowledge-back"
          onClick={onBack}
        >
          Back to dashboard
        </button>

        <div className="knowledge-brand">
          <span className="knowledge-brand-mark">P</span>
          <div>
            <strong>Prism</strong>
            <small>Knowledge base</small>
          </div>
        </div>
      </header>

      <section className="knowledge-content">
        <div className="knowledge-heading">
          <p className="knowledge-eyebrow">ADMIN WORKSPACE</p>
          <h1>Knowledge base</h1>
          <p>
            Organize the FAQs, policies, and product information that will
            help your support assistant answer customer questions.
          </p>
        </div>

        <div className="knowledge-stats">
          <div className="knowledge-stat">
            <span>Total entries</span>
            <strong>{entries.length}</strong>
          </div>
          <div className="knowledge-stat">
            <span>Saved documents</span>
            <strong>{files.length}</strong>
          </div>
          <div className="knowledge-stat">
            <span>Categories used</span>
            <strong>
              {new Set(manualEntries.map((entry) => entry.category)).size}
            </strong>
          </div>
        </div>

        <section className="knowledge-panel">
          <div className="knowledge-panel-heading">
            <div>
              <h2>Upload documents</h2>
              <p>
                Upload PDF, TXT, or DOCX files. Prism will extract their
                text and save it to your knowledge base.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="knowledge-upload-zone"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
          >
            <span className="knowledge-upload-icon">↑</span>
            <strong>{saving ? "Processing..." : "Choose files to upload"}</strong>
            <span>PDF, TXT, or DOCX · Up to 5 MB per file</span>
            <span className="knowledge-upload-button">Browse files</span>
          </button>

          <input
            ref={fileInputRef}
            className="knowledge-file-input"
            type="file"
            accept=".pdf,.txt,.docx"
            multiple
            onChange={handleFiles}
            disabled={saving}
          />

          {files.length > 0 && (
            <div className="knowledge-file-list">
              {files.map((file) => (
                <div className="knowledge-file" key={file._id}>
                  <span className="knowledge-file-mark">DOC</span>
                  <div className="knowledge-file-details">
                    <strong>{file.fileName || file.title}</strong>
                    <span>Text extracted and saved to database</span>
                  </div>
                  <button
                    type="button"
                    className="knowledge-remove"
                    onClick={() => removeEntry(file._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="knowledge-panel">
          <div className="knowledge-panel-heading">
            <div>
              <h2>Add information manually</h2>
              <p>Create individual entries for your knowledge base.</p>
            </div>
          </div>

          <div className="knowledge-tabs" role="tablist">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeTab === category}
                className={`knowledge-tab ${
                  activeTab === category ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(category);
                  setNotice("");
                }}
              >
                {category === "FAQ"
                  ? "FAQs"
                  : category === "Policy"
                    ? "Policies"
                    : "Products"}
              </button>
            ))}
          </div>

          <form className="knowledge-form" onSubmit={addEntry}>
            {activeTab === "FAQ" ? (
              <>
                <label htmlFor="faq-question">Customer question</label>
                <input
                  id="faq-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="e.g. How can I track my order?"
                  required
                />

                <label htmlFor="faq-answer">Answer</label>
                <textarea
                  id="faq-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Write the answer..."
                  rows={4}
                  required
                />
              </>
            ) : (
              <>
                <label htmlFor="entry-title">
                  {activeTab === "Policy" ? "Policy name" : "Product name"}
                </label>
                <input
                  id="entry-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={
                    activeTab === "Policy"
                      ? "e.g. Return and refund policy"
                      : "e.g. Classic Cotton T-Shirt"
                  }
                  required
                />

                <label htmlFor="entry-description">
                  {activeTab === "Policy"
                    ? "Policy details"
                    : "Product description"}
                </label>
                <textarea
                  id="entry-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter the details..."
                  rows={4}
                  required
                />

                {activeTab === "Product" && (
                  <>
                    <label htmlFor="entry-price">Price</label>
                    <input
                      id="entry-price"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="e.g. $29.99"
                      required
                    />
                  </>
                )}
              </>
            )}

            <div className="knowledge-form-footer">
              <span>
                {saving
                  ? "Saving...": ""}
              </span>
              <button
                className="knowledge-save-button"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : `Add ${activeTab}`}
              </button>
            </div>
          </form>
        </section>

        <section className="knowledge-panel">
          <div className="knowledge-panel-heading">
            <div>
              <h2>Knowledge entries</h2>
              <p>Review and manage your saved information.</p>
            </div>
            <span className="knowledge-count">
              {manualEntries.length} entries
            </span>
          </div>

          {loading ? (
            <div className="knowledge-empty">
              <p>Loading saved entries...</p>
            </div>
          ) : manualEntries.length === 0 ? (
            <div className="knowledge-empty">
              <strong>No entries yet</strong>
              <p>Your FAQs, policies, and products will appear here.</p>
            </div>
          ) : (
            <div className="knowledge-entry-list">
              {manualEntries.map((entry) => (
                <article className="knowledge-entry" key={entry._id}>
                  <div className="knowledge-entry-top">
                    <span className="knowledge-category">
                      {entry.category}
                    </span>
                    <button
                      type="button"
                      className="knowledge-remove"
                      onClick={() => removeEntry(entry._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <h3>{entry.title}</h3>
                  <p>{entry.content}</p>

                  {entry.price && (
                    <strong className="knowledge-price">
                      {entry.price}
                    </strong>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {notice && (
          <p className="knowledge-notice" role="status">
            {notice}
          </p>
        )}
      </section>
    </main>
  );
}

export default KnowledgeBase;
