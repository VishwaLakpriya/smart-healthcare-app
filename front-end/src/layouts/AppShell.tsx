import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import CareNetLogo from "../assets/care_net.jpg";
import { useAuth } from "../auth/AuthContext";
import { useState, type JSX } from "react";

const NavItem = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
        isActive ? "bg-[#E6F2F7] text-[#1E6E8D] font-semibold" : "text-slate-700 hover:bg-slate-100"
      }`
    }
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="bg-[#EEF2F4]">
      {/* Fixed sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 px-5 pt-5 pb-4">
          <img src={CareNetLogo} alt="CareNet" className="w-9 h-9 rounded-lg ring-1 ring-[#C7D6DF] p-1" />
          <div className="text-2xl font-bold">
            <span className="text-[#186B8C]">Care</span>
            <span className="text-[#57B33E]">Net</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="px-4 py-3 space-y-1">
          {/* <div className="text-xs uppercase tracking-wide text-slate-500 px-2">Menu</div> */}
          <NavItem to="/" label="Dashboard" icon={<IconHome />} />
          <NavItem to="/patients" label="Patients" icon={<IconUsers />} />
          <NavItem to="/doctors" label="Doctors" icon={<IconDoctor />} />
          <NavItem to="/checkin/start" label="Check-in" icon={<IconScan />} />
          <NavItem to="/appointment" label="Appointment" icon={<IconCalendar />} />
          <NavItem to="/reports" label="Reports" icon={<IconChart />} />
        </nav>

        {/* spacer */}
        <div className="flex-1" />

        {/* Profile & logout (bottom-left) */}
        <div className="p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E6E8D] text-white grid place-items-center font-bold">
                {user?.name?.split(/\s+/).map((p) => p[0]).join("").slice(0, 2) || "ST"}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{user?.name || "Staff User"}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email || "staff@carenet.lk"}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/profile"
                className="text-center text-[#1A6C8C] text-sm rounded-lg border border-slate-300 bg-white py-1 hover:bg-slate-100"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-center text-sm rounded-lg border border-rose-300 bg-rose-50 py-1 text-rose-700 hover:bg-rose-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column (scrolls) */}
      <div className="ml-72 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-10">
          <form onSubmit={onSearch} className="w-full max-w-xl">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search patients, doctors, or appointments"
                className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-3 outline-none focus:border-[#1E6E8D] bg-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <IconSearch />
              </span>
            </div>
          </form>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* --- tiny inline icons --- */
function IconHome(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/></svg>)}
function IconUsers(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>)}
function IconDoctor(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/><path d="M9 14h6"/><path d="M12 11v6"/></svg>)}
function IconScan(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>)}
function IconCalendar(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>)}
function IconChart(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 15v3"/><path d="M12 10v8"/><path d="M17 6v12"/></svg>)}
function IconSearch(){return(<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/></svg>)}
