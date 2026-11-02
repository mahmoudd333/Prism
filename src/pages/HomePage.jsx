import ChatWidget from "../components/ChatWidget";
import "./HomePage.css";

const helpTopics = [
  "Orders & tracking",
  "Shipping",
  "Returns & refunds",
  "Products",
];

function HomePage({ onSignIn }) {
  const openChat = () => {
    window.dispatchEvent(new Event("open-support-chat"));
  };

  return (
    <main className="home-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Prism home">
          <span className="brand-icon">P</span>

          <span className="brand-copy">
            <strong>Prism</strong>
            <span>Your shopping assistant</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <button className="sign-in-button" onClick={onSignIn}>
            Sign in
          </button>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="hero-eyebrow">
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

          <button className="primary-button" onClick={openChat}>
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
          <div className="art-orbit orbit-three" />

          <div className="art-center">
            <div className="art-center-inner" />
          </div>

          <span className="art-dot dot-one" />
          <span className="art-dot dot-two" />
          <span className="art-dot dot-three" />
        </div>
      </section>

      <section className="help-section" id="help">
        <div className="section-heading">
          <span>HERE FOR YOU</span>
          <h2>We're here to make things easier.</h2>
          <p>
            From finding your order to learning about our products,
            get the support you need in one place.
          </p>
        </div>

        <div className="help-topics">
          {helpTopics.map((topic) => (
            <span className="help-topic" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section className="contact-section" id="about">
        <div className="contact-icon">P</div>

        <div className="contact-copy">
          <h2>Need a little more help?</h2>
          <p>
            Start a conversation with our assistant and
            we'll help you find the information you need.
          </p>
        </div>

        <button className="secondary-button" onClick={openChat}>
          Chat with us
        </button>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#home">
          Prism
        </a>
        <span>Here to make things easier.</span>
      </footer>

      <ChatWidget />
    </main>
  );
}

export default HomePage;
