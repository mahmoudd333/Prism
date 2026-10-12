
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  function showComingSoon(feature) {
    alert(`${feature} page will be added later.`);
  }

  return (
    <main className="admin-dashboard-page">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-brand-icon">✦</span>
          <span>Support Assistant</span>
        </div>

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
            <div className="admin-option-icon">📚</div>
            <h2>Knowledge Base</h2>
            <p>
              Upload and manage FAQs, company policies, and product
              information to help your chatbot answer customers.
            </p>
            <span className="admin-option-link">
              Manage knowledge base →
            </span>
          </button>

          <button
            className="admin-option-card"
            onClick={() => showComingSoon("Admin Analytics")}
          >
            <div className="admin-option-icon">📊</div>
            <h2>Admin Analytics</h2>
            <p>
              Review common customer questions and identify queries
              the chatbot could not answer.
            </p>
            <span className="admin-option-link">
              View analytics →
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
