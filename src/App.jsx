import { useState } from "react";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import KnowledgeBase from "./pages/KnowledgeBase";

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

  if (currentPage === "knowledge-base") {
    return (
      <KnowledgeBase
        onBack={() => setCurrentPage("admin-dashboard")}
      />
    );
  }

  if (currentPage === "admin-dashboard") {
    return (
      <AdminDashboard
        onLogout={() => setCurrentPage("home")}
        onOpenKnowledgeBase={() => setCurrentPage("knowledge-base")}
      />
    );
  }

  return (
    <HomePage onSignIn={() => setCurrentPage("admin-login")} />
  );
}

export default App;
