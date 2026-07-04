import { useState } from "react";
import api from "../api/api";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

function PaymentVerification() {
  const [memberId, setMemberId] = useState("");
  const [provider, setProvider] = useState("telebirr");
  const [telebirrRef, setTelebirrRef] = useState("");
  const [cbeRef, setCbeRef] = useState("");
  const [cbeAccountSuffix, setCbeAccountSuffix] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const verifyPayment = async () => {
    const cleanMemberId = memberId.trim();

    if (!cleanMemberId) {
      setError("Please enter a valid Member ID before verifying.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      // Handles both purely numeric inputs and strings containing characters
      const parsedMemberId = /^\d+$/.test(cleanMemberId)
        ? Number(cleanMemberId)
        : cleanMemberId;

      let payload = {
        memberId: parsedMemberId,
        paymentMethod: provider,
      };

      if (provider === "telebirr") {
        payload.reference = telebirrRef.trim();
      }

      if (provider === "cbe") {
        payload.reference = cbeRef.trim();
        payload.accountSuffix = cbeAccountSuffix.trim();
      }

      const res = await api.post("/payments/verify", payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  const StatusUI = ({ status }) => {
    switch (status) {
      case "PAID":
      case "SUCCESS":
        return (
          <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            Payment Verified
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-2 text-yellow-500 font-medium text-sm">
            <AccessTimeIcon sx={{ fontSize: 18 }} />
            Pending Verification
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
            <CancelIcon sx={{ fontSize: 18 }} />
            Verification Failed
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303] px-4">
      <Sidebar />
      <ThemeToggle />
      <div className="w-full max-w-md bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-all">
        {/* TITLE */}
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
          Payment Verification
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Verify digital transaction details manually
        </p>

        {/* MEMBER ID INPUT */}
        <div className="mt-5">
          <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
            Target Member Profile
          </label>
          <div className="relative">
            <BadgeIcon
              className="absolute left-3 top-2.5 text-zinc-400"
              sx={{ fontSize: 16 }}
            />
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Enter Member ID (e.g., 1, RAS-402, or MEM/89)"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
            />
          </div>
        </div>

        {/* PROVIDER SELECT */}
        <div className="mt-4">
          <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
            Payment Processor
          </label>
          <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setProvider("telebirr");
                setError("");
                setResult(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                provider === "telebirr"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              Telebirr
            </button>

            <button
              type="button"
              onClick={() => {
                setProvider("cbe");
                setError("");
                setResult(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                provider === "cbe"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              CBE
            </button>
          </div>
        </div>

        {/* PROVIDER SPECIFIC TRANSACTION INPUTS */}
        <div className="mt-4 space-y-3">
          <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 -mb-1.5 uppercase tracking-wider">
            Transaction Details
          </label>

          {provider === "telebirr" && (
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-2.5 text-zinc-400"
                sx={{ fontSize: 16 }}
              />
              <input
                value={telebirrRef}
                onChange={(e) => setTelebirrRef(e.target.value)}
                placeholder="Telebirr reference (e.g., CE626EJRNS)"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          )}

          {provider === "cbe" && (
            <>
              <div className="relative">
                <SearchIcon
                  className="absolute left-3 top-2.5 text-zinc-400"
                  sx={{ fontSize: 16 }}
                />
                <input
                  value={cbeRef}
                  onChange={(e) => setCbeRef(e.target.value)}
                  placeholder="CBE reference (e.g., FT25244MV3ZX)"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
                />
              </div>

              <div className="relative">
                <SearchIcon
                  className="absolute left-3 top-2.5 text-zinc-400"
                  sx={{ fontSize: 16 }}
                />
                <input
                  value={cbeAccountSuffix}
                  onChange={(e) => setCbeAccountSuffix(e.target.value)}
                  placeholder="Last 8 digits of account (e.g., 18205729)"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
                />
              </div>
            </>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={verifyPayment}
          disabled={loading}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-black py-2 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <CircularProgress size={14} color="inherit" />
              Verifying transaction...
            </>
          ) : (
            "Verify Payment"
          )}
        </button>

        {/* ERROR SUMMARY LAYER */}
        {error && (
          <p className="text-red-500 font-medium text-[11px] mt-3 bg-red-500/5 border border-red-500/10 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* ACTION RESULT PREVIEW */}
        {result && (
          <div className="mt-5 p-4 border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-xl space-y-3">
            <StatusUI status={result.status} />

            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1.5 font-mono pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {result.amount || "—"} ETB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sender:</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {result.senderName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-medium uppercase">
                  {provider}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentVerification;
