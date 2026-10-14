import ChatWidget from "../components/ChatWidget";
import "./HomePage.css";

const helpTopics = [
  {
    title: "Orders & tracking",
    description: "Get help finding your order information.",
    message: "How can I track my order?",
  },
  {
    title: "Shipping",
    description: "Learn about delivery and shipping fees.",
    message: "Tell me about shipping.",
  },
  {
    title: "Returns & refunds",
    description: "Learn about returns and refund policies.",
    message: "What is your return policy?",
  },
  {
    title: "Products",
    description: "Ask questions about products and prices.",
    message: "Tell me about your products.",
  },
];

function HomePage({ onSignIn }) {
  return (
    <main className="home-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Prism home">
          <span className="brand-icon">✦</span>

          <span className="brand-copy">
            <strong>Prism</strong>
            <span>Your shopping assistant</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#help">Help center</a>
          <a href="#about">About</a>
          <button
            className="sign-in-button"
            onClick={onSignIn}
          >
            Sign in
          </button>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="hero-eyebrow">
            <span className="hero-sparkle">✦</span>
            YOUR PERSONAL SUPPORT ASSISTANT
          </span>

          <h1>
            How can we
            <br />
            help you <span>today?</span>
          </h1>

          <p>
            Have a question? We're here to help with orders,
            products, shipping, and returns. Get started with
            our support assistant.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              window.dispatchEvent(
                new Event("open-support-chat")
              )
            }
          >
            Start a conversation
            <span aria-hidden="true">↗</span>
          </button>

          <div className="availability">
            <span className="availability-dot" />
            Your support assistant is ready
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />

          <div className="art-card">
            <div className="art-card-icon">✦</div>
            <div>
              <strong>How can I help?</strong>
              <p>I'm here whenever you need me.</p>
            </div>
          </div>

          <div className="art-bubble bubble-one">
            Track my order
          </div>

          <div className="art-bubble bubble-two">
            Of course! Let's get started.
          </div>

          <div className="art-center">✦</div>
        </div>
      </section>

      <section className="help-section" id="help">
        <div className="section-heading">
          <span>HERE FOR YOU</span>
          <h2>What can I help you with?</h2>
          <p>
            Choose a topic to get started, or ask us anything
            using the chat assistant.
          </p>
        </div>

        <div className="help-grid">
          {helpTopics.map((topic) => (
            <button
              className="help-card"
              key={topic.title}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-support-chat", {
                    detail: { message: topic.message },
                  })
                )
              }
            >
              <span className="help-card-title">
                {topic.title}
              </span>

              <span className="help-card-description">
                {topic.description}
              </span>

              <span className="help-card-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="contact-section" id="about">
        <div className="contact-icon">✦</div>

        <div className="contact-copy">
          <h2>Need a little more help?</h2>
          <p>
            Start a conversation with our assistant and
            we'll help you find the information you need.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            window.dispatchEvent(
              new Event("open-support-chat")
            )
          }
        >
          Chat with us
        </button>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#home">
          ✦ Prism
        </a>
        <span>Here to make things easier.</span>
      </footer>

      <ChatWidget />
    </main>
  );
}

export default HomePage;
