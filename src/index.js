import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import Main from "./pages/main";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  sessionStorage.setItem("orderByString", "");
  sessionStorage.setItem("SQLGeradoFinal", "Nenhum SQL gerado no momento");
  sessionStorage.removeItem("loadedQuery");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/reports/login" />} />
        <Route path="reports/login" element={<Login />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
