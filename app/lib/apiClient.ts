// // lib/apiClient.ts


// //Axios: Handles all HTTP requests and automatically attaches the JWT.
// //TanStack React Query: Manages server state, caching, loading states, retries, and mutations.
// //React Hook Form + Zod: Handles forms and validation with minimal boilerplate.
// //

// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:8080',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Automatically inject auth tokens if needed
// apiClient.interceptors.request.use((config) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default apiClient;


import axios from "axios";
import { auth } from "../lib/tanstack/auth";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = auth.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;