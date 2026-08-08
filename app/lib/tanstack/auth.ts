const TOKEN_KEY = "auth_token";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export const auth = {
  saveToken(token: string) {
    if (typeof window !== "undefined") {
      // keep localStorage for client-side checks
      localStorage.setItem(TOKEN_KEY, token);

      // also set a cookie so Next.js middleware (server-side) can read it
      // cookie is intentionally not Secure to work on localhost; adjust flags for production
      document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24}`; // 1 day
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    const local = localStorage.getItem(TOKEN_KEY);
    if (local) return local;
    return getCookie("token");
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      // expire the cookie
      document.cookie = "token=; path=/; max-age=0";
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY) || !!getCookie("token");
  },
};