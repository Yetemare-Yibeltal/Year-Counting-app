import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import your pages/components
import Home from "./pages/Home";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add additional public & protected routes here */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;