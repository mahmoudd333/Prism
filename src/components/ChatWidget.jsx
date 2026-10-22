import { useEffect, useRef, useState } from "react";
import { sendMessageToAI } from "../services/chatService";
import "./ChatWidget.css";

const welcomeMessage = {
  id: 1,
  sender: "bot",
  text: "Hi there! 👋 Welcome to our store. How can I help you today?",
};

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const requestIdRef = useRef(0);
  const isTypingRef = useRef(false);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleOpenChat(event) {
      setIsOpen(true);

      const suggestedMessage = event.detail?.message;

      if (suggestedMessage) {
        sendMessage(suggestedMessage);
      }
    }

    window.addEventListener("open-support-chat", handleOpenChat);

    return () => {
      window.removeEventListener(
        "open-support-chat",
        handleOpenChat
      );
    };
  }, []);

  async function sendMessage(text) {
    const messageText = text.trim();

    if (!messageText || isTypingRef.current) return;

    const currentRequest = ++requestIdRef.current;

    isTypingRef.current = true;
    setIsTyping(true);

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "user",
        text: messageText,
      },
    ]);

    setInput("");

    try {
      const reply = await sendMessageToAI(messageText);

      if (currentRequest !== requestIdRef.current) return;

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: reply,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      if (currentRequest === requestIdRef.current) {
        isTypingRef.current = false;
        setIsTyping(false);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }
  
  return (
    <>
      {isOpen && (
        <section
          className="chat-widget"
          aria-label="Customer support chat"
        >
          <header className="chat-header">
            <div className="chat-bot-avatar">✦</div>

            <div className="chat-header-info">
              <h2>AI Assistant</h2>
              <p>
                <span className="chat-online-dot" />
                Here to help you
              </p>
            </div>

            <div className="chat-header-actions">

              <button
                className="chat-header-icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </header>

          <div className="chat-messages">
            <div className="chat-date-divider">
              YOUR CONVERSATION
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message-row ${
                  message.sender === "user"
                    ? "chat-user-row"
                    : "chat-bot-row"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="chat-message-avatar">✦</div>
                )}

                <div
                  className={`chat-message ${
                    message.sender === "user"
                      ? "chat-user-message"
                      : "chat-bot-message"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row chat-bot-row">
                <div className="chat-message-avatar">✦</div>

                <div
                  className="chat-message chat-bot-message chat-typing"
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

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              disabled={isTyping}
            />

            <button
              type="submit"
              className="chat-send-button"
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
            <span>✦</span>
          </footer>
        </section>
      )}

      <button
        className={`chat-launcher ${isOpen ? "chat-launcher-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className="chat-launcher-close">×</span>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" />
            </svg>

            <span className="chat-launcher-label">
              Chat with us
            </span>
          </>
        )}
      </button>
    </>
  );
}

export default ChatWidget;
