
import { useState } from "react";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  if (currentPage === "admin-login") {
    return (
      <AdminLogin
        onLogin={() => setCurrentPage("admin-dashboard")}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "admin-dashboard") {
    return (
      <AdminDashboard
        onLogout={() => setCurrentPage("home")}
      />
    );
  }

  return (
    <HomePage
      onSignIn={() => setCurrentPage("admin-login")}
    />
  );
}

export default App;

