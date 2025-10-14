import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CareNetLogo from "../assets/care_net.jpg"; // update if your filename differs

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"clerk" | "admin">("clerk");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pwOk =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pwOk) return;
    setLoading(true);
    setErr(null);
    try {
      await register(name, email, password, role);
      nav("/"); // go to Dashboard after auto-login
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E4C58] via-[#186B8C] to-[#1E6E8D]">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 rounded-[28px] bg-white/5 p-3 backdrop-blur-lg ring-1 ring-white/10">
          {/* LEFT: form */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 ring-1 ring-[#C7D6DF] shadow-sm">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
              <img src={CareNetLogo} className="w-12 h-12 rounded-xl ring-1 ring-[#C7D6DF] p-1" alt="CareNet" />
              <div className="text-2xl font-bold">
                <span className="text-[#186B8C]">Care</span>
                <span className="text-[#57B33E]">Net</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A6C8C]">Create your staff account</h1>
            <p className="text-slate-600 mt-2">Only hospital staff can register here.</p>

            <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  className="mt-2 w-full rounded-[14px] border-2 border-[#C7D6DF] px-4 py-3 outline-none focus:border-[#1A6C8C] bg-white text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="e.g., Nimal Perera"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  className="mt-2 w-full rounded-[14px] border-2 border-[#C7D6DF] px-4 py-3 outline-none focus:border-[#1A6C8C] bg-white text-black"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@carenet.lk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-[14px] border-2 border-[#C7D6DF] px-4 py-3 pr-12 outline-none focus:border-[#1A6C8C] bg-white text-black"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min 8 chars with A/a/0/@"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-slate-600 hover:text-[#1A6C8C]"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className={`text-xs mt-1 ${pwOk ? "text-emerald-600" : "text-slate-500"}`}>
                  Must be ≥8 chars and include upper, lower, digit, special.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select
                  className="mt-2 w-full rounded-[14px] border-2 border-[#C7D6DF] px-4 py-3 outline-none focus:border-[#1A6C8C] bg-white text-black"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="clerk">Clerk</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {err && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{err}</div>}

              <button
                type="submit"
                disabled={loading || !pwOk}
                className="mt-2 h-12 rounded-[14px] bg-gradient-to-r from-[#186B8C] to-[#57B33E] text-white font-semibold shadow-md hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Creating…" : "Register"}
              </button>

              <p className="text-sm mt-2 text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#1A6C8C] font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* RIGHT: simple brand panel */}
          <div className="relative rounded-[24px] overflow-hidden ring-1 ring-white/10 hidden md:block">
            <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_80%_30%,#57B33E_0%,#1E6E8D_45%,#0B3F4D_100%)]" />
            <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
            <div className="relative p-10">
              <div className="flex items-center gap-3">
                <img src={CareNetLogo} className="w-12 h-12 rounded-xl bg-white p-1 ring-1 ring-white/40" />
                <div className="text-4xl font-extrabold text-white/90 drop-shadow">CareNet</div>
              </div>
              <div className="mt-6 text-white/90 max-w-md leading-relaxed">
                Secure staff access for appointments, check-ins, and reports.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
