// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector
import InvoiceForm from "./pages/InvoiceForm";
import Login from "./pages/Loginpage";
import Signup from "./pages/Signuppage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import InvoicesPage from "./pages/Allinvoices";
import NavbarAndHeader from "./components/Navbar";

function App() {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  ); // Select the authentication state

  return (
    <Router>
      {/* Navbar fixed at the top */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarAndHeader />
      </div>

      {/* Add padding to account for the fixed navbar height */}
      <div className="pt-16">
        {" "}
        {/* Add padding of 16 (4rem) to push content down */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <InvoiceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <InvoicesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
