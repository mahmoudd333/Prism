
import { useEffect, useRef, useState } from "react";
import "./App.css";

const welcomeMessage = {
  id: 1,
  sender: "bot",
  text: "Hi there! 👋 Welcome to our store. How can I help you today?",
};

const temporaryReplies = [
  "Thanks for your question! I'm a demo assistant for now. Once the AI model is connected, I'll be able to give you more accurate answers.",
  "That's a great question! I'm currently using temporary replies. Soon, I'll be able to answer using the store's FAQs, policies, and product information.",
  "I'd be happy to help! The real AI assistant will be connected here later.",
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function handleSend(event) {
    event.preventDefault();

    const text = input.trim();

    if (!text || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    // Temporary demo response. Replace with an AI API call later.
    setTimeout(() => {
      const reply =
        temporaryReplies[
          Math.floor(Math.random() * temporaryReplies.length)
        ];

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: reply,
        },
      ]);

      setIsTyping(false);
    }, 1000);
  }

  function handleReset() {
    setMessages([welcomeMessage]);
    setInput("");
    setIsTyping(false);
  }

  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">CUSTOMER SUPPORT</span>

        <h1>How can we help you?</h1>

        <p>
          Have a question? Open our support chat and
          start a conversation with our assistant.
        </p>

        <button
          className="hero-button"
          onClick={() => setIsOpen(true)}
        >
          <span>Chat with us</span>
          <span aria-hidden="true">↗</span>
        </button>

        <div className="hero-note">
          <span className="status-dot" />
          Support assistant available
        </div>
      </section>

      {isOpen && (
        <section
          className="chat-widget"
          aria-label="Customer support chat"
        >
          <header className="chat-header">
            <div className="bot-avatar">✦</div>

            <div className="header-info">
              <h2>AI Assistant</h2>
              <p>
                <span className="online-dot" />
                Here to help you
              </p>
            </div>

            <div className="header-actions">
              <button
                className="header-icon"
                onClick={handleReset}
                aria-label="Start a new conversation"
                title="New conversation"
              >
                ↻
              </button>

              <button
                className="header-icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </header>

          <div className="chat-body">
            <div className="date-divider">
              <span>YOUR CONVERSATION</span>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${
                  message.sender === "user"
                    ? "user-row"
                    : "bot-row"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="message-avatar">✦</div>
                )}

                <div
                  className={`message ${
                    message.sender === "user"
                      ? "user-message"
                      : "bot-message"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot-row">
                <div className="message-avatar">✦</div>

                <div
                  className="message bot-message typing"
                  aria-label="Assistant is typing"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              disabled={isTyping}
            />

            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4Z" />
              </svg>
            </button>
          </form>

          <footer className="chat-footer">
            Powered by <strong>AI</strong>
            <span className="footer-sparkle">✦</span>
          </footer>
        </section>
      )}

      {!isOpen && (
        <button
          className="chat-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open customer support chat"
        >
          <svg
            viewBox="0 0 24 24"
            width="27"
            height="27"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" />
          </svg>

          <span className="launcher-label">Chat with us</span>
        </button>
      )}
    </main>
  );
}

export default App;