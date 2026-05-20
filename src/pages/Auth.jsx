import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sports, ArrowForward } from "@mui/icons-material";

function Auth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id || !password) return;
    setLoading(true);

    try {
      await login(id, password);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 antialiased selection:bg-blue-500/30">
      <div className="w-full max-w-[360px] px-6 py-10">
        {/* Minimalist Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
            <Sports className="text-zinc-950 !text-xl" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Enter your credentials to access analytics
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-zinc-500 ml-1 uppercase tracking-wider">
              Identifier
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="admin-id"
              className="w-full h-11 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 transition-all outline-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 transition-all outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-11 mt-4 bg-zinc-100 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowForward className="!text-base group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center">
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest">
            login bruvvvv
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Auth;
