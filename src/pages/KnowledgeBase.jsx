
import { useRef, useState } from "react";
import "./KnowledgeBase.css";

const categories = ["FAQ", "Policy", "Product"];

function KnowledgeBase({ onBack }) {
  const [activeTab, setActiveTab] = useState("FAQ");
  const [entries, setEntries] = useState([]);
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);

  function addEntry(event) {
    event.preventDefault();

    let entry;

    if (activeTab === "FAQ") {
      entry = {
        id: crypto.randomUUID(),
        category: "FAQ",
        title: question.trim(),
        content: answer.trim(),
      };
    } else {
      entry = {
        id: crypto.randomUUID(),
        category: activeTab,
        title: title.trim(),
        content: description.trim(),
        ...(activeTab === "Product" ? { price: price.trim() } : {}),
      };
    }

    if (
      !entry.title ||
      !entry.content ||
      (activeTab === "Product" && !price.trim())
    ) {
      setNotice("Please complete all required fields.");
      return;
    }

    setEntries((previous) => [entry, ...previous]);
    setQuestion("");
    setAnswer("");
    setTitle("");
    setDescription("");
    setPrice("");
    setNotice("Entry added successfully.");
  }

  function handleFiles(event) {
    const selected = Array.from(event.target.files || []);

    setFiles((previous) => [
      ...previous,
      ...selected.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
      })),
    ]);

    if (selected.length) {
      setNotice(
        "Files selected for this demo. They have not been uploaded to a server."
      );
    }

    event.target.value = "";
  }

  function removeEntry(id) {
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
    setNotice("Entry deleted.");
  }

  function removeFile(id) {
    setFiles((previous) => previous.filter((file) => file.id !== id));
    setNotice("File removed from the list.");
  }

  return (
    <main className="knowledge-page">
      <header className="knowledge-header">
        <button className="knowledge-back" onClick={onBack}>
          ← Back to dashboard
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
            <span>Selected documents</span>
            <strong>{files.length}</strong>
          </div>
          <div className="knowledge-stat">
            <span>Categories used</span>
            <strong>
              {new Set(entries.map((entry) => entry.category)).size}
            </strong>
          </div>
        </div>

        <section className="knowledge-panel">
          <div className="knowledge-panel-heading">
            <div>
              <h2>Upload documents</h2>
              <p>
                Select documents containing FAQs, policies, or product details.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="knowledge-upload-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="knowledge-upload-icon">↑</span>
            <strong>Choose files to upload</strong>
            <span>PDF, TXT, DOC, or DOCX</span>
            <span className="knowledge-upload-button">Browse files</span>
          </button>

          <input
            ref={fileInputRef}
            className="knowledge-file-input"
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            multiple
            onChange={handleFiles}
          />

          {files.length > 0 && (
            <div className="knowledge-file-list">
              {files.map((file) => (
                <div className="knowledge-file" key={file.id}>
                  <span className="knowledge-file-mark">DOC</span>
                  <div className="knowledge-file-details">
                    <strong>{file.name}</strong>
                    <span>
                      {(file.size / 1024).toFixed(1)} KB · Selected locally
                    </span>
                  </div>
                  <button
                    type="button"
                    className="knowledge-remove"
                    onClick={() => removeFile(file.id)}
                  >
                    Remove
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
              <span>Demo only: entries are not saved to a database.</span>
              <button className="knowledge-save-button" type="submit">
                Add {activeTab}
              </button>
            </div>
          </form>
        </section>

        <section className="knowledge-panel">
          <div className="knowledge-panel-heading">
            <div>
              <h2>Knowledge entries</h2>
              <p>Review and manage the information you have added.</p>
            </div>
            <span className="knowledge-count">{entries.length} entries</span>
          </div>

          {entries.length === 0 ? (
            <div className="knowledge-empty">
              <strong>No entries yet</strong>
              <p>Your FAQs, policies, and products will appear here.</p>
            </div>
          ) : (
            <div className="knowledge-entry-list">
              {entries.map((entry) => (
                <article className="knowledge-entry" key={entry.id}>
                  <div className="knowledge-entry-top">
                    <span className="knowledge-category">
                      {entry.category}
                    </span>
                    <button
                      type="button"
                      className="knowledge-remove"
                      onClick={() => removeEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <h3>{entry.title}</h3>
                  <p>{entry.content}</p>

                  {entry.price && (
                    <strong className="knowledge-price">{entry.price}</strong>
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
