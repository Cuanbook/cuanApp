import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Account from "@/mobile/Account";
import Dashboard from "@/mobile/Dashboard";
import { Login } from "@/mobile/Login";
import Report from "@/mobile/Report";
import { SignUp } from "@/mobile/SignUp";
import Transaction from "@/mobile/Transaction";
import MobileWarning from "@/components/ui/MobileWarning";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <MobileWarning>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/report" element={<Report />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    </MobileWarning>
  </StrictMode>
);