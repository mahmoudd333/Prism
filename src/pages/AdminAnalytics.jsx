import { useMemo, useState } from "react";
import "./AdminAnalytics.css";

const sampleConversations = [
  {
    id: "PS-1042",
    customer: "Guest 1042",
    date: "Oct 19, 2026 · 10:42 AM",
    status: "Resolved",
    messages: [
      { sender: "Customer", text: "How can I track my order?" },
      {
        sender: "Prism",
        text: "You can track your order using the tracking link in your shipping confirmation email.",
      },
    ],
  },
  {
    id: "PS-1041",
    customer: "Guest 1041",
    date: "Oct 19, 2026 · 10:18 AM",
    status: "Needs support",
    messages: [
      { sender: "Customer", text: "My package arrived damaged. What should I do?" },
      {
        sender: "Prism",
        text: "I couldn't find enough information to answer this confidently. This conversation needs human support.",
      },
    ],
  },
  {
    id: "PS-1040",
    customer: "Guest 1040",
    date: "Oct 19, 2026 · 09:55 AM",
    status: "Resolved",
    messages: [
      { sender: "Customer", text: "How long does shipping take?" },
      {
        sender: "Prism",
        text: "Standard shipping usually takes 3–5 business days.",
      },
    ],
  },
  {
    id: "PS-1039",
    customer: "Guest 1039",
    date: "Oct 19, 2026 · 09:30 AM",
    status: "Needs support",
    messages: [
      { sender: "Customer", text: "Can I exchange an item after 45 days?" },
      {
        sender: "Prism",
        text: "I don't have enough information about exchanges after 45 days. Please contact our support team.",
      },
    ],
  },
  {
    id: "PS-1038",
    customer: "Guest 1038",
    date: "Oct 18, 2026 · 04:12 PM",
    status: "Resolved",
    messages: [
      { sender: "Customer", text: "Do you have the Classic Cotton T-Shirt?" },
      {
        sender: "Prism",
        text: "Please check the store's product listing for the latest availability.",
      },
    ],
  },
];

const commonQuestions = [
  { question: "How can I track my order?", count: 48 },
  { question: "What is your return policy?", count: 36 },
  { question: "How long does shipping take?", count: 29 },
  { question: "Where can I find product prices?", count: 21 },
];

const unansweredQuestions = [
  { question: "My package arrived damaged. What should I do?", count: 12 },
  { question: "Can I exchange an item after 45 days?", count: 8 },
  { question: "When will an out-of-stock item return?", count: 6 },
];

function AdminAnalytics({ onBack }) {
  const [conversations, setConversations] = useState(sampleConversations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(sampleConversations[0].id);
  const [activeSection, setActiveSection] = useState("overview");

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesStatus =
        statusFilter === "All" || conversation.status === statusFilter;

      const searchableText = [
        conversation.id,
        conversation.customer,
        ...conversation.messages.map((message) => message.text),
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(term);
    });
  }, [conversations, search, statusFilter]);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ||
    filteredConversations[0] ||
    null;

  const resolvedCount = conversations.filter(
    (conversation) => conversation.status === "Resolved"
  ).length;

  const supportCount = conversations.filter(
    (conversation) => conversation.status === "Needs support"
  ).length;

  function updateStatus(id, status) {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? { ...conversation, status }
          : conversation
      )
    );
  }

  return (
    <main className="analytics-page">
      <header className="analytics-header">
        <button className="analytics-back" onClick={onBack}>
          ← Back to dashboard
        </button>

        <div className="analytics-brand">
          <span className="analytics-brand-mark">P</span>
          <span>
            <strong>Prism</strong>
            <small>Admin analytics</small>
          </span>
        </div>
      </header>

      <section className="analytics-content">
        <div className="analytics-heading">
          <p className="analytics-eyebrow">ADMIN WORKSPACE</p>
          <h1>Analytics & conversations</h1>
          <p>
            Understand customer questions, find gaps in your knowledge base,
            and review support conversations.
          </p>
        </div>

        <nav className="analytics-tabs" aria-label="Analytics sections">
          <button
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>
          <button
            className={activeSection === "unanswered" ? "active" : ""}
            onClick={() => setActiveSection("unanswered")}
          >
            Unanswered questions
          </button>
          <button
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setActiveSection("history")}
          >
            Conversation history
          </button>
        </nav>

        {activeSection !== "history" && (
          <>
            {activeSection === "overview" && (
              <div className="analytics-stats">
                <article className="analytics-stat">
                  <span>Total conversations</span>
                  <strong>{conversations.length}</strong>
                  <small>Sample conversations</small>
                </article>
                <article className="analytics-stat">
                  <span>Resolved conversations</span>
                  <strong>{resolvedCount}</strong>
                  <small>Marked as resolved</small>
                </article>
                <article className="analytics-stat">
                  <span>Need human support</span>
                  <strong>{supportCount}</strong>
                  <small>Require further assistance</small>
                </article>
                <article className="analytics-stat">
                  <span>Unanswered question types</span>
                  <strong>{unansweredQuestions.length}</strong>
                  <small>Sample question categories</small>
                </article>
              </div>
            )}

            <section className="analytics-panel">
              <div className="analytics-panel-heading">
                <div>
                  <h2>
                    {activeSection === "unanswered"
                      ? "Unanswered questions"
                      : "Common customer questions"}
                  </h2>
                  <p>
                    {activeSection === "unanswered"
                      ? "Questions Prism may need more information to answer."
                      : "Frequently asked questions in this sample dataset."}
                  </p>
                </div>
              </div>

              <div className="analytics-question-list">
                {(activeSection === "unanswered"
                  ? unansweredQuestions
                  : commonQuestions
                ).map((item, index) => (
                  <article className="analytics-question" key={item.question}>
                    <span className="analytics-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="analytics-question-copy">
                      <strong>{item.question}</strong>
                      <span>
                        {activeSection === "unanswered"
                          ? "Needs knowledge base review"
                          : "Customer question"}
                      </span>
                    </div>
                    <span className="analytics-question-count">
                      {item.count} <small>{activeSection === "unanswered" ? "reports" : "asks"}</small>
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === "history" && (
          <section className="analytics-panel">
            <div className="analytics-panel-heading">
              <div>
                <h2>Conversation history</h2>
                <p>Search customer conversations and review their messages.</p>
              </div>
              <span className="analytics-demo-label">Demo data</span>
            </div>

            <div className="analytics-filters">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages or guest ID..."
                aria-label="Search conversations"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by conversation status"
              >
                <option value="All">All statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="Needs support">Needs support</option>
              </select>
            </div>

            <div className="analytics-history-layout">
              <div className="analytics-conversation-list">
                {filteredConversations.length === 0 ? (
                  <p className="analytics-empty">No conversations found.</p>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`analytics-conversation ${
                        selectedConversation?.id === conversation.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setSelectedId(conversation.id)}
                    >
                      <span className="analytics-conversation-top">
                        <strong>{conversation.customer}</strong>
                        <span
                          className={`analytics-status ${
                            conversation.status === "Resolved"
                              ? "resolved"
                              : "needs-support"
                          }`}
                        >
                          {conversation.status}
                        </span>
                      </span>
                      <span className="analytics-conversation-id">
                        {conversation.id}
                      </span>
                      <span className="analytics-conversation-preview">
                        {conversation.messages[0].text}
                      </span>
                      <span className="analytics-conversation-date">
                        {conversation.date}
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className="analytics-message-panel">
                {selectedConversation ? (
                  <>
                    <div className="analytics-message-heading">
                      <div>
                        <h3>{selectedConversation.customer}</h3>
                        <span>{selectedConversation.id}</span>
                      </div>
                      <span
                        className={`analytics-status ${
                          selectedConversation.status === "Resolved"
                            ? "resolved"
                            : "needs-support"
                        }`}
                      >
                        {selectedConversation.status}
                      </span>
                    </div>

                    <div className="analytics-messages">
                      {selectedConversation.messages.map((message, index) => (
                        <div
                          key={`${selectedConversation.id}-${index}`}
                          className={`analytics-message ${
                            message.sender === "Customer"
                              ? "customer-message"
                              : "assistant-message"
                          }`}
                        >
                          <span>{message.sender}</span>
                          <p>{message.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="analytics-message-actions">
                      <label htmlFor="conversation-status">
                        Update status
                      </label>
                      <select
                        id="conversation-status"
                        value={selectedConversation.status}
                        onChange={(event) =>
                          updateStatus(
                            selectedConversation.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="Resolved">Resolved</option>
                        <option value="Needs support">Needs support</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <p className="analytics-empty">
                    Select a conversation to view its messages.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <p className="analytics-demo-note">
          This page uses sample data for the frontend demo. Counts and status
          changes are not connected to real customer conversations and will
          reset when the page is reloaded.
        </p>
      </section>
    </main>
  );
}

export default AdminAnalytics;
