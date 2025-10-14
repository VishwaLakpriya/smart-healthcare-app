// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CareNetLogo from "../assets/care_net.jpg"; // <- put your logo here

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      // (optional) persist email for "remember me" in localStorage
      if (remember) localStorage.setItem("carenet:lastEmail", email);
      else localStorage.removeItem("carenet:lastEmail");

      await login(email, password);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E4C58] via-[#186B8C] to-[#1E6E8D] text-slate-900">
      {/* page frame */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 items-stretch rounded-[28px] bg-white/5 p-2 md:p-3 backdrop-blur-lg ring-1 ring-white/10">
          {/* LEFT: form panel */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 ring-1 ring-[#C7D6DF] shadow-sm">
            {/* brand */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src={CareNetLogo}
                alt="CareNet"
                className="w-12 h-12 rounded-xl ring-1 ring-[#C7D6DF] p-1 bg-white"
              />
              <div className="text-2xl font-bold tracking-tight">
                <span className="text-[#186B8C]">Care</span>
                <span className="text-[#57B33E]">Net</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A6C8C]">
              Welcome back
            </h1>
            <p className="text-slate-600 mt-2">
              Sign in to your <span className="font-medium">staff</span> account
            </p>

            <form className="mt-8 grid gap-5" onSubmit={onSubmit} noValidate>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  className="mt-2 w-full rounded-[14px] border-2 border-[#C7D6DF] px-4 py-3 outline-none focus:border-[#1A6C8C] transition bg-white text-black"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@carenet.lk"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot" className="text-sm text-[#1A6C8C] hover:underline">
                    Forgot?
                  </Link>
                </div>

                <div className="relative mt-2">
                  <input
                    className="w-full rounded-[14px] border-2 border-[#C7D6DF] px-4 py-3 pr-12 outline-none focus:border-[#1A6C8C] transition bg-white text-black"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-slate-600 hover:text-[#1A6C8C]"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? (
                      // eye-off
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.04.36-2.06 1.02-3M6.23 6.23A11.94 11.94 0 0112 5c5 0 9 4 9 7 0 1.27-.5 2.53-1.42 3.73M3 3l18 18" />
                      </svg>
                    ) : (
                      // eye
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <circle cx="12" cy="12" r="3" strokeWidth={2} />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Use your staff credentials. Patients do not sign in here.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="accent-[#1E6E8D] h-4 w-4"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <span className="text-xs text-slate-500">
                  Need access? Ask an <span className="font-medium">admin</span>.
                </span>
              </div>

              {err && (
                <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 rounded-[14px] bg-gradient-to-r from-[#186B8C] to-[#57B33E] text-white font-semibold shadow-md hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Login"}
              </button>

              {/* divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-px flex-1 bg-slate-300" />
                <span className="text-xs text-slate-500">or</span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>

              {/* social sign-in placeholders */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-11 rounded-[12px] border-2 border-[#C7D6DF] bg-white hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-700">Sign in with Google</span>
                </button>
                <button
                  type="button"
                  className="h-11 rounded-[12px] border-2 border-[#C7D6DF] bg-white hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-700">Sign in with Apple</span>
                </button>
              </div>
            </form>

            <p className="text-sm mt-6 text-slate-600">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#1A6C8C] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>

          {/* RIGHT: hero panel */}
          <div className="relative rounded-[24px] overflow-hidden ring-1 ring-white/10 hidden md:block">
            {/* gradient scene */}
            <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_80%_30%,#57B33E_0%,#1E6E8D_45%,#0B3F4D_100%)]" />
            {/* soft vignette */}
            <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
            {/* headline */}
            <div className="relative p-10">
              <div className="max-w-md">
                <div className="text-5xl leading-tight font-serif text-white/90 drop-shadow-sm">
                  Caring made simple
                </div>
                <div className="mt-2 text-5xl leading-tight font-serif text-white/90 drop-shadow-sm">
                  with <span className="font-sans font-light">CareNet</span>
                </div>
              </div>
            </div>

            {/* demo card */}
            <div className="absolute bottom-6 right-6 flex items-end gap-4">
              <div className="h-36 w-16 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-white/40" />
              <div className="h-56 w-80 rounded-3xl bg-white/90 backdrop-blur ring-1 ring-white/40 p-6">
                <img src={CareNetLogo} alt="" className="w-6 h-6 rounded-lg mb-6" />
                <div className="text-slate-700 font-semibold">Next Appointment</div>
                <div className="text-2xl font-extrabold text-[#1A6C8C] mt-1">12:30 — Cardiology</div>
                <div className="text-slate-500 text-sm mt-1">Dr. Roshan • Ref 22558</div>
                <div className="mt-6 flex justify-between text-sm text-slate-600">
                  <span>Primary Card</span>
                  <span className="font-semibold text-[#186B8C]">View All</span>
                </div>
              </div>
            </div>

            {/* corner badge (logo) */}
            <div className="absolute left-6 top-6 w-12 h-12 rounded-2xl grid place-items-center bg-white/95 ring-1 ring-white/40">
              <img src={CareNetLogo} alt="CareNet" className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
