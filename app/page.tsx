// 'use client';

// import Link from 'next/link';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '../app/lib/store';
// import { logout } from '../app/lib/features/authSlice';

// export default function Home() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { token } = useSelector((state: RootState) => state.auth);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
//       <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-md border">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Insurance System
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Welcome to the user authentication portal.
//         </p>

//         {token ? (
//           <div className="space-y-4">
//             <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
//               You are currently logged in!
//             </div>
//             <button
//               onClick={() => dispatch(logout())}
//               className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
//             >
//               Log Out
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-3">
//             <Link
//               href="/login"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition text-center"
//             >
//               Sign In
//             </Link>
//             <Link
//               href="/signup"
//               className="w-full bg-gray-100 text-gray-800 border border-gray-300 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition text-center"
//             >
//               Create Account
//             </Link>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../app/lib/tanstack/auth";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(auth.isAuthenticated());
  }, []);

  const handleLogout = () => {
    auth.removeToken();
    setLoggedIn(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Brand Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-200">
            <svg
              className="h-8 w-8"
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            SecureCover
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Insurance Management System
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          <div className="p-8 sm:p-10">
            {loggedIn ? (
              /* ─── Logged In State ─────────────────────────────── */
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <svg
                    className="h-7 w-7 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  You are signed in
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Welcome back to the SecureCover portal.
                </p>

                <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm font-medium text-emerald-700">
                  Session is active and secure
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.98]"
                  >
                    Go to Dashboard
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Logged Out State ────────────────────────────── */
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your insurance dashboard or create a new
                  account.
                </p>

                <div className="mt-8 space-y-3">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.98]"
                  >
                    Sign in
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>

                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Create account
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-emerald-500"
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
                    <span>Encrypted</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SecureCover Insurance · All rights
          reserved
        </p>
      </main>
    </div>
  );
}