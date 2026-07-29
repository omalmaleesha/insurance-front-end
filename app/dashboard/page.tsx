"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/tanstack/auth";
import FileTransferTracking from "./FileTransferTracking";
import Proposal from "../dashboard/Proposal";
import Quotation from "./Quotation";

export default function DashboardPage() {
  const router = useRouter();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "file-transfer" | "proposal" | "quotation"
  >("file-transfer");

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    auth.removeToken();
    router.replace("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-emerald-50/40 text-slate-800">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col border-r border-emerald-100 bg-white shadow-sm transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-100 px-4">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Insurance<span className="text-emerald-600">App</span>
              </span>
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 ${
              isSidebarCollapsed ? "mx-auto" : ""
            }`}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-3">
          {/* File Transfer Item */}
          <button
            onClick={() => setActiveTab("file-transfer")}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "file-transfer"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>

            {!isSidebarCollapsed && (
              <span className="truncate">File Transfer</span>
            )}

            {isSidebarCollapsed && (
              <div className="absolute left-full z-50 ml-3 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-lg whitespace-nowrap group-hover:block">
                File Transfer
              </div>
            )}
          </button>

          {/* Proposal Item */}
          <button
            onClick={() => setActiveTab("proposal")}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "proposal"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>

            {!isSidebarCollapsed && <span className="truncate">Proposal</span>}

            {isSidebarCollapsed && (
              <div className="absolute left-full z-50 ml-3 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-lg whitespace-nowrap group-hover:block">
                Proposal
              </div>
            )}
          </button>

          {/* Quotation Item */}
          <button
            onClick={() => setActiveTab("quotation")}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "quotation"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m-6 4h6m-6 4h4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
              />
            </svg>

            {!isSidebarCollapsed && (
              <span className="truncate">Quotations</span>
            )}

            {isSidebarCollapsed && (
              <div className="absolute left-full z-50 ml-3 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-lg whitespace-nowrap group-hover:block">
                Quotations
              </div>
            )}
          </button>
        </nav>

        {/* Footer / Logout */}
        <div className="border-t border-emerald-100 p-3">
          <button
            onClick={handleLogout}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            {!isSidebarCollapsed && <span>Logout</span>}

            {isSidebarCollapsed && (
              <div className="absolute left-full z-50 ml-3 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-lg whitespace-nowrap group-hover:block">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-emerald-100 bg-white/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === "file-transfer"
                ? "File Transfer Tracking"
                : activeTab === "proposal"
                ? "Proposal Management"
                : "Quotation Management"}
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 capitalize">
              {activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
              US
            </div>
          </div>
        </header>

        {/* Dynamic Page Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="rounded-2xl border border-emerald-100/60 bg-white p-6 shadow-sm">
            {activeTab === "file-transfer" && <FileTransferTracking />}
            {activeTab === "proposal" && <Proposal />}
            {activeTab === "quotation" && <Quotation />}
          </div>
        </div>
      </main>
    </div>
  );
}