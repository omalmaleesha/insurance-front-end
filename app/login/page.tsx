"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useLogin } from "../hooks/useLogin";
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const mutation = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim() || !password) return;

      mutation.mutate({
        username: username.trim(),
        password,
      });
    },
    [username, password, mutation]
  );

  const isSubmitDisabled = useMemo(() => {
    return mutation.isPending || !username.trim() || !password;
  }, [mutation.isPending, username, password]);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070d19] text-slate-100">
      {/* Background Glow Overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Branding Panel */}
        <div className="hidden w-[45%] flex-col justify-between border-r border-slate-800/80 bg-gradient-to-br from-[#0b1329] via-emerald-950/40 to-[#070d19] p-12 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-emerald-400" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-100">SecureCover</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-100">
              Protect what
              <br />
              matters most.
            </h2>
            <p className="max-w-sm text-lg leading-relaxed text-slate-400">
              Manage policies, claims, and coverage in one secure place built for peace of mind.
            </p>

            <div className="flex items-center gap-6 pt-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <span>Encrypted data</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © {currentYear} SecureCover Insurance
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-10 lg:w-[55%]">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/40">
                <Shield className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-slate-100">SecureCover</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                Welcome back
              </h1>
              <p className="mt-2 text-slate-400">
                Sign in to access your insurance dashboard
              </p>
            </div>

            {/* Error Alert */}
            {mutation.isError && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-400"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
                <span>
                  {(mutation.error as Error)?.message ||
                    "Invalid credentials. Please check your username and password."}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Username or Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="you@company.com"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    autoComplete="username"
                    autoFocus
                    className="w-full rounded-xl border border-slate-800 bg-[#0b1329] py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="rounded text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-800 bg-[#0b1329] py-3 pl-11 pr-12 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#070d19] rounded-r-xl"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-[#0b1329] text-emerald-600 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-1 focus:ring-offset-[#070d19]"
                />
                <label htmlFor="remember" className="text-sm text-slate-400">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="rounded font-semibold text-emerald-400 transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19]"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}