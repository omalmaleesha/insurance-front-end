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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Insurance System
        </h1>

        <p className="mb-6 text-gray-600">
          Welcome to the user authentication portal.
        </p>

        {loggedIn ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
              You are currently logged in!
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-center font-medium text-gray-800 transition hover:bg-gray-200"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}