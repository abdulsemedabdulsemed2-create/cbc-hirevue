import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    // small delay for smoother button feedback
    await new Promise((r) => setTimeout(r, 250));

    const user = username.trim();
    const pass = password.trim();

    if (login(user, pass)) {
      navigate("/intro");
      return;
    }

    setError("Invalid credentials");
    setLoading(false);
  };

  const handleJoinNow = () => {
    // You can change this later to a real join/signup route
    alert("Join Now clicked");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070A] text-white">
      {/* Option 1: Aurora Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

      {/* Extra subtle vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.75)]" />

      {/* Center card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Login</h1>
            <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
            <p className="mt-3 text-xs text-slate-400">Authorized Access Only</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 21a8 8 0 0 0-16 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  placeholder="Enter username"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 11V8a5 5 0 0 1 10 0v3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 11h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  placeholder="Enter password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-center text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Log In"}
              </button>

<button
type="button"
disabled
className="relative isolate overflow-hidden rounded-xl px-6 py-3 font-semibold
cursor-not-allowed opacity-95"
>
{/* base dark glass */}
<span className="absolute inset-0 rounded-xl bg-white/5 border border-white/10" />
<span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-700/40 to-blue-600/40" />

{/* TEXT (intentionally unreadable) */}
<span className="relative z-10 text-white/60 blur-[6px] select-none">
Join Now
</span>

{/* heavy fog layers */}
<span aria-hidden className="pointer-events-none absolute inset-0 z-20">
<span className="cbc-fogA" />
<span className="cbc-fogB" />
<span className="cbc-haze" />
</span>

{/* optional: tiny “coming soon” hint on hover */}
<span className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100">
<span className="text-[11px] tracking-widest uppercase text-white/70">
Coming soon
</span>
</span>

<style>{`
.cbc-haze{
position:absolute; inset:0;
backdrop-filter: blur(10px);
background: rgba(255,255,255,0.03);
}

.cbc-fogA, .cbc-fogB{
position:absolute;
top:-60%;
width:120%;
height:220%;
border-radius:9999px;
filter: blur(26px);
opacity:0.75;
mix-blend-mode: screen;
}

.cbc-fogA{
left:-80%;
background: radial-gradient(
closest-side,
rgba(255,255,255,0.35),
rgba(180,160,255,0.12),
rgba(0,0,0,0)
);
animation: fogMoveA 2.8s ease-in-out infinite;
}

.cbc-fogB{
left:-120%;
background: radial-gradient(
closest-side,
rgba(120,200,255,0.30),
rgba(255,255,255,0.10),
rgba(0,0,0,0)
);
animation: fogMoveB 3.6s ease-in-out infinite;
}

@keyframes fogMoveA{
0% { transform: translateX(0%) rotate(-10deg); }
50% { transform: translateX(85%) rotate(10deg); }
100% { transform: translateX(170%) rotate(-10deg); }
}

@keyframes fogMoveB{
0% { transform: translateX(10%) rotate(8deg); }
50% { transform: translateX(95%) rotate(-8deg); }
100% { transform: translateX(190%) rotate(8deg); }
}
`}</style>
</button>
            </div>

            {/* Hint
            <p className="pt-2 text-center text-xs text-slate-500">
              Demo login: <span className="text-slate-300">admin / admin123</span>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
