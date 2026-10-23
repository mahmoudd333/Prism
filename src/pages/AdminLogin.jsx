import "./AdminLogin.css";

function AdminLogin({ onLogin, onBack }) {
  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
  }

  return (
    <main className="admin-login-page">
      <button className="back-button" onClick={onBack}>
        ← Back to homepage
      </button>

      <section className="login-card">
        <div className="login-icon">✦</div>

        <h1>Admin Sign In</h1>
        <p>Sign in to manage your customer support chatbot.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

        <p className="demo-notice">
          Frontend demo: enter any email and password to continue.
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
