import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// No Authorization header!
// Customers are not logged in.

export default publicApi;