// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin'); // or '/login'
  };

  const navLinkBase =
    'block text-left rounded-lg px-3 py-2 text-sm transition font-medium';
  const inactive = 'text-slate-700 hover:bg-slate-100';
  const active = 'text-slate-900 bg-slate-100';

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen w-full bg-slate-100">
      {/* Fixed Top Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 md:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isSidebarOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Layout under the fixed header */}
      <div className="pt-16 flex">
        {/* Mobile overlay when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-md z-40 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
        >
          <nav className="h-full flex flex-col px-4 py-6 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Menu
            </div>

            <NavLink
              end
              to="/dashboard"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? active : inactive}`
              }
              onClick={closeSidebar}
            >
              Overview
            </NavLink>

            <NavLink
              to="/dashboard/upload-file"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? active : inactive}`
              }
              onClick={closeSidebar}
            >
              Upload Resume
            </NavLink>

            <NavLink
              to="/dashboard/resume-data"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? active : inactive}`
              }
              onClick={closeSidebar}
            >
              Add resume datas
            </NavLink>

            <div className="mt-auto pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Account</p>
              <button
                onClick={() => {
                  closeSidebar();
                  handleSignOut();
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content (shifted right of sidebar on md+) */}
        <main className="flex-1 p-4 sm:p-6 md:ml-64">
          <div className="w-full rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-lg mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
