import { useState, useEffect } from "react";
import api from "../api/api";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

// Asset Imports
import CbeLogo from "../assets/cbe.jpg";
import TeleLogo from "../assets/tele.jpg";

function PaymentVerification() {
  // Form States
  const [provider, setProvider] = useState("cbe"); // 'cbe' or 'telebirr'
  const [memberRasId, setMemberRasId] = useState("");
  const [reference, setReference] = useState("");
  const [fullAccount, setFullAccount] = useState("");

  // Status States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Auto-slice utility to cleanly get the last 8 digits
  const getSuffixFromAccount = (accountStr) => {
    const cleaned = accountStr.replace(/\s+/g, "").replace(/-/g, ""); // Remove spaces or dashes
    if (cleaned.length < 8) return cleaned;
    return cleaned.slice(-8); // Slice last 8 characters
  };

  // Reset full account if switching away from cbe
  useEffect(() => {
    if (provider !== "cbe") {
      setFullAccount("");
    }
  }, [provider]);

  // Auto-clear feedback blocks when user modifies any input field
  useEffect(() => {
    if (result || error) {
      setResult(null);
      setError("");
    }
  }, [provider, memberRasId, reference, fullAccount]);

  const verifyPayment = async () => {
    const cleanRasId = memberRasId.trim();
    const cleanRef = reference.trim();
    const finalSuffix = getSuffixFromAccount(fullAccount);

    // Base validation
    if (!cleanRasId || !cleanRef) {
      setError("Please fill out all identification fields.");
      return;
    }

    // Validation for CBE account details
    if (provider === "cbe") {
      if (!fullAccount.trim()) {
        setError("Account number is required for CBE verification.");
        return;
      }
      if (finalSuffix.length < 8) {
        setError(
          "Please enter a valid CBE account number (requires at least 8 digits).",
        );
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const payload = {
        provider,
        memberRasId: cleanRasId,
        reference: cleanRef,
        ...(provider === "cbe" && { suffix: finalSuffix }),
      };

      const res = await api.post("/payments/verify", payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submission via Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      verifyPayment();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#030303] px-4 py-12 transition-colors duration-300 relative overflow-x-hidden">
      <Sidebar />
      <ThemeToggle />

      <div className="w-full max-w-md bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Payment Gateway Verification
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Verify automated system clearances smoothly.
          </p>
        </div>

        {/* PROVIDER SELECTION */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">
            Select Payment Provider
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* CBE Card */}
            <button
              type="button"
              onClick={() => setProvider("cbe")}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                provider === "cbe"
                  ? "border-purple-600 bg-purple-50/30 dark:bg-purple-950/10 ring-2 ring-purple-600/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
              }`}
            >
              <img
                src={CbeLogo}
                alt="CBE"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                  CBE Birr
                </p>
                <p className="text-[10px] text-zinc-400">Commercial Bank</p>
              </div>
            </button>

            {/* Telebirr Card */}
            <button
              type="button"
              onClick={() => setProvider("telebirr")}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                provider === "telebirr"
                  ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/10 ring-2 ring-blue-500/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
              }`}
            >
              <img
                src={TeleLogo}
                alt="Telebirr"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                  Telebirr
                </p>
                <p className="text-[10px] text-zinc-400">Ethio Telecom</p>
              </div>
            </button>
          </div>
        </div>

        {/* INPUT FORM CONTAINER */}
        <div onKeyDown={handleKeyDown} className="space-y-4">
          {/* MEMBER RAS ID */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Member Registry ID
            </label>
            <div className="relative group">
              <BadgeIcon
                className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors"
                sx={{ fontSize: 16 }}
              />
              <input
                type="text"
                value={memberRasId}
                onChange={(e) => setMemberRasId(e.target.value)}
                placeholder="e.g., RAST0349"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          {/* TRANSACTION REFERENCE */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Transaction Reference
            </label>
            <div className="relative group">
              <SearchIcon
                className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors"
                sx={{ fontSize: 16 }}
              />
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., FT25244MV3ZX"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          {/* DYNAMIC FULL CBE ACCOUNT INPUT (Slices suffix automatically) */}
          {provider === "cbe" && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Reciever Account Number
                </label>
              </div>
              <div className="relative group">
                <AccountBalanceIcon
                  className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors"
                  sx={{ fontSize: 16 }}
                />
                <input
                  type="text"
                  value={fullAccount}
                  onChange={(e) => setFullAccount(e.target.value)}
                  placeholder="e.g., 1000123456789"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={verifyPayment}
          disabled={loading}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-black py-2.5 rounded-xl text-xs font-semibold hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer relative"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Verifying Secure Connection...</span>
            </div>
          ) : (
            "Verify Transaction"
          )}
        </button>

        {/* FEEDBACK STATUS CARDS */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500 dark:text-red-400 transition-all animate-fadeIn">
            <CancelIcon className="mt-0.5 shrink-0" sx={{ fontSize: 16 }} />
            <span className="text-[11px] font-medium leading-relaxed">
              {error}
            </span>
          </div>
        )}

        {result && (
          <div className="mt-4 transition-all animate-fadeIn">
            {result.success ? (
              <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  Payment Confirmed Successfully
                </div>
                <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1 pl-6">
                  {result.message}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500 dark:text-red-400">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <CancelIcon sx={{ fontSize: 16 }} />
                  Verification Rejected
                </div>
                <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1 pl-6">
                  {result.message ||
                    "The transaction details provided mismatch our registry record database."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentVerification;
