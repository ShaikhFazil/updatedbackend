// src/components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./ui/shared/Navbar";
import { Sidebar } from "./Sidebar";
import { useSelector } from "react-redux";

const Layout = () => {
  const { user } = useSelector(store => store.auth);
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <Navbar />
      </header>
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;