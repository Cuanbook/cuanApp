import { StrictMode, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Account from "@/mobile/Account";
import Dashboard from "@/mobile/Dashboard";
import { Login } from "@/mobile/Login";
import Report from "@/mobile/Report";
import { SignUp } from "@/mobile/SignUp";
import Transaction from "@/mobile/Transaction";
import MobileWarning from "@/components/ui/MobileWarning";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavigationProvider, useNavigation } from "@/lib/context/NavigationContext";

// Component to handle route changes
const RouteChangeHandler = () => {
  const location = useLocation();
  const { stopLoading } = useNavigation();

  const handleRouteChange = useCallback(() => {
    // Add a small delay to ensure components are mounted
    const timeoutId = window.setTimeout(() => {
      stopLoading();
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [stopLoading]);

  useEffect(() => {
    return handleRouteChange();
  }, [location, handleRouteChange]);

  return null;
};

// Wrap the app content in a component to ensure context is available
const AppContent = () => (
  <Router>
    <RouteChangeHandler />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#FAFAFA',
          color: '#111611',
        },
        success: {
          iconTheme: {
            primary: '#54D12B',
            secondary: '#FAFAFA',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FAFAFA',
          },
        },
      }}
    />
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/transaction" element={
        <ProtectedRoute>
          <Transaction />
        </ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute>
          <Report />
        </ProtectedRoute>
      } />
      <Route path="/account" element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
);

const App = () => (
  <StrictMode>
    <NavigationProvider>
      <MobileWarning>
        <AppContent />
      </MobileWarning>
    </NavigationProvider>
  </StrictMode>
);

// Get the container element
const container = document.getElementById("app");

// Ensure the container exists
if (!container) {
  throw new Error("Could not find root element with id 'app'");
}

// Create root only once
const root = createRoot(container);

// Initial render
root.render(<App />);

// Handle hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}