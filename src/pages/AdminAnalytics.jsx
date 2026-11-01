import { useCallback, useEffect, useMemo, useState } from "react";
import "./AdminAnalytics.css";
import {
  getAdminConversations,
  getAdminConversation,
  sendAdminReply,
  updateConversationStatus,
  getCommonQuestions,
} from "../services/chatService";

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getConversationId(conversation) {
  return conversation.conversationId || conversation.id;
}

function AdminAnalytics({ onBack }) {
  const [conversations, setConversations] = useState([]);
  const [customerQuestions, setCustomerQuestions] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeSection, setActiveSection] = useState("overview");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("prismAdminToken");

  const loadConversations = useCallback(async () => {
    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [loadedConversations, loadedQuestions] = await Promise.all([
        getAdminConversations(token),
        getCommonQuestions(token),
      ]);

      setConversations(loadedConversations);
      setCustomerQuestions(loadedQuestions);

      if (loadedConversations.length > 0) {
        const currentId = selectedConversation
          ? getConversationId(selectedConversation)
          : null;

        const selectedStillExists = loadedConversations.find(
          (conversation) => getConversationId(conversation) === currentId
        );

        const nextConversation =
          selectedStillExists || loadedConversations[0];

        await loadConversationDetails(getConversationId(nextConversation));
      } else {
        setSelectedConversation(null);
      }
    } catch (err) {
      setError(err.message || "Could not load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadConversationDetails = async (conversationId) => {
    try {
      setDetailLoading(true);

      const data = await getAdminConversation(token, conversationId);
      setSelectedConversation(data.conversation || data);
    } catch (err) {
      setError(err.message || "Could not load conversation details.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesStatus =
        statusFilter === "All" || conversation.status === statusFilter;

      const searchableText = [
        getConversationId(conversation),
        conversation.customerLabel || "Guest",
        ...(conversation.messages || []).map((message) => message.text),
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(term);
    });
  }, [conversations, search, statusFilter]);

  const unansweredQuestions = useMemo(() => {
    const questions = {};

    conversations
      .filter((conversation) => conversation.status === "Needs support")
      .forEach((conversation) => {
        const firstCustomerMessage = (conversation.messages || []).find(
          (message) => message.sender === "Customer"
        );

        if (firstCustomerMessage) {
          const question = firstCustomerMessage.text.trim();
          questions[question] = (questions[question] || 0) + 1;
        }
      });

    return Object.entries(questions)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count);
  }, [conversations]);

  const resolvedCount = conversations.filter(
    (conversation) => conversation.status === "Resolved"
  ).length;

  const supportCount = conversations.filter(
    (conversation) => conversation.status === "Needs support"
  ).length;

  async function handleSelectConversation(conversation) {
    await loadConversationDetails(getConversationId(conversation));
  }

  async function handleStatusChange(status) {
    if (!selectedConversation) return;

    const conversationId = getConversationId(selectedConversation);

    try {
      setError("");

      await updateConversationStatus(token, conversationId, status);

      setSelectedConversation((previous) => ({
        ...previous,
        status,
        handoffRequested: status === "Needs support",
      }));

      setConversations((previous) =>
        previous.map((conversation) =>
          getConversationId(conversation) === conversationId
            ? {
                ...conversation,
                status,
                handoffRequested: status === "Needs support",
              }
            : conversation
        )
      );
    } catch (err) {
      setError(err.message || "Could not update conversation status.");
    }
  }

  async function handleSendReply(event) {
    event.preventDefault();

    const messageText = reply.trim();

    if (!messageText || !selectedConversation) return;

    try {
      setSendingReply(true);
      setError("");

      const conversationId = getConversationId(selectedConversation);

      await sendAdminReply(token, conversationId, messageText);

      setReply("");
      await loadConversationDetails(conversationId);
      await loadConversations();
    } catch (err) {
      setError(err.message || "Could not send your reply.");
    } finally {
      setSendingReply(false);
    }
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

        {error && <p className="analytics-error">{error}</p>}

        {loading ? (
          <p className="analytics-empty">Loading conversations...</p>
        ) : (
          <>
            {activeSection !== "history" && (
              <>
                {activeSection === "overview" && (
                  <div className="analytics-stats">
                    <article className="analytics-stat">
                      <span>Total conversations</span>
                      <strong>{conversations.length}</strong>
                      <small>Stored conversations</small>
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
                      <small>Questions needing review</small>
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
                          ? "Questions from conversations that need human support."
                          : "Frequently asked questions grouped by AI based on their meaning."}
                      </p>
                    </div>
                  </div>

                  <div className="analytics-question-list">
                    {(activeSection === "unanswered"
                      ? unansweredQuestions
                      : customerQuestions
                    ).length === 0 ? (
                      <p className="analytics-empty">
                        No questions to display yet.
                      </p>
                    ) : (
                      (activeSection === "unanswered"
                        ? unansweredQuestions
                        : customerQuestions
                      ).map((item, index) => (
                        <article
                          className="analytics-question"
                          key={item.question}
                        >
                          <span className="analytics-rank">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="analytics-question-copy">
                            <strong>{item.question}</strong>
                            <span>
                              {activeSection === "unanswered"
                                ? "Needs knowledge base review"
                                : "Similar customer questions grouped by meaning"}
                            </span>
                          </div>

                          <span className="analytics-question-count">
                            {item.count}{" "}
                            <small>
                              {item.count === 1 ? "time" : "times"}
                            </small>
                          </span>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </>
            )}

            {activeSection === "history" && (
              <section className="analytics-panel">
                <div className="analytics-panel-heading">
                  <div>
                    <h2>Conversation history</h2>
                    <p>
                      Search customer conversations and respond to messages.
                    </p>
                  </div>

                  <button
                    className="analytics-refresh"
                    onClick={loadConversations}
                  >
                    Refresh
                  </button>
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
                    <option value="Active">Active</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Needs support">Needs support</option>
                  </select>
                </div>

                <div className="analytics-history-layout">
                  <div className="analytics-conversation-list">
                    {filteredConversations.length === 0 ? (
                      <p className="analytics-empty">
                        No conversations found.
                      </p>
                    ) : (
                      filteredConversations.map((conversation) => {
                        const id = getConversationId(conversation);

                        return (
                          <button
                            key={id}
                            className={`analytics-conversation ${
                              selectedConversation &&
                              getConversationId(selectedConversation) === id
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleSelectConversation(conversation)
                            }
                          >
                            <span className="analytics-conversation-top">
                              <strong>
                                {conversation.customerLabel || "Guest"}
                              </strong>

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
                              {id}
                            </span>

                            <span className="analytics-conversation-preview">
                              {conversation.messages?.[0]?.text ||
                                "No messages"}
                            </span>

                            <span className="analytics-conversation-date">
                              {formatDate(
                                conversation.updatedAt ||
                                  conversation.createdAt
                              )}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="analytics-message-panel">
                    {detailLoading ? (
                      <p className="analytics-empty">
                        Loading conversation...
                      </p>
                    ) : selectedConversation ? (
                      <>
                        <div className="analytics-message-heading">
                          <div>
                            <h3>
                              {selectedConversation.customerLabel || "Guest"}
                            </h3>
                            <span>
                              {getConversationId(selectedConversation)}
                            </span>
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
                          {(selectedConversation.messages || []).map(
                            (message, index) => (
                              <div
                                key={message._id || index}
                                className={`analytics-message ${
                                  message.sender === "Customer"
                                    ? "customer-message"
                                    : "assistant-message"
                                }`}
                              >
                                <span>{message.sender}</span>
                                <p>{message.text}</p>
                                <small>
                                  {formatDate(message.createdAt)}
                                </small>
                              </div>
                            )
                          )}
                        </div>

                        <div className="analytics-message-actions">
                          <label htmlFor="conversation-status">
                            Update status
                          </label>

                          <select
                            id="conversation-status"
                            value={selectedConversation.status}
                            onChange={(event) =>
                              handleStatusChange(event.target.value)
                            }
                          >
                            <option value="Active">Active</option>
                            <option value="Needs support">
                              Needs support
                            </option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>

                        <form
                          className="analytics-reply-form"
                          onSubmit={handleSendReply}
                        >
                          <label htmlFor="admin-reply">
                            Reply to customer
                          </label>

                          <textarea
                            id="admin-reply"
                            value={reply}
                            onChange={(event) => setReply(event.target.value)}
                            placeholder="Write your response..."
                            rows={3}
                          />

                          <button
                            type="submit"
                            disabled={sendingReply || !reply.trim()}
                          >
                            {sendingReply ? "Sending..." : "Send reply"}
                          </button>
                        </form>
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
          </>
        )}
      </section>
    </main>
  );
}

export default AdminAnalytics;
