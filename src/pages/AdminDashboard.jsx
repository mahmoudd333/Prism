import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  function showComingSoon(feature) {
    alert(`${feature} page will be added later.`);
  }

  return (
    <main className="admin-dashboard-page">
      <header className="admin-header">
        <a className="admin-brand" href="/" aria-label="Prism home">
          <span className="admin-brand-icon">✦</span>
          <span className="admin-brand-copy">
            <strong>Prism</strong>
            <span>Admin dashboard</span>
          </span>
        </a>

        <button className="logout-button" onClick={onLogout}>
          Sign out
        </button>
      </header>

      <section className="admin-content">
        <p className="admin-eyebrow">ADMIN PANEL</p>

        <h1>Welcome back!</h1>

        <p className="admin-description">
          Manage your chatbot knowledge and monitor customer questions.
        </p>

        <div className="admin-options">
          <button
            className="admin-option-card"
            onClick={() => showComingSoon("Knowledge Base")}
          >
            <span className="admin-option-number">01</span>

            <span className="admin-option-icon knowledge-icon">
              <span />
              <span />
              <span />
            </span>

            <h2>Knowledge Base</h2>

            <p>
              Upload and manage FAQs, company policies, and product
              information to help your chatbot answer customers.
            </p>

            <span className="admin-option-link">
              Manage knowledge base <span aria-hidden="true">↗</span>
            </span>
          </button>

          <button
            className="admin-option-card"
            onClick={() => showComingSoon("Admin Analytics")}
          >
            <span className="admin-option-number">02</span>

            <span className="admin-option-icon analytics-icon">
              <span />
              <span />
              <span />
              <span />
            </span>

            <h2>Admin Analytics</h2>

            <p>
              Review common customer questions and identify queries
              the chatbot could not answer.
            </p>

            <span className="admin-option-link">
              View analytics <span aria-hidden="true">↗</span>
            </span>
          </button>
        </div>
      </section>

      <footer className="admin-footer">
        <span>Prism</span>
        <span>Admin workspace</span>
      </footer>
    </main>
  );
}

export default AdminDashboard;
