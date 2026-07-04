import { useState } from "react";
import api from "../api/api";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

function PaymentVerification() {
  const [memberRasId, setMemberRasId] = useState("");
  const [reference, setReference] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const verifyPayment = async () => {
    const cleanRasId = memberRasId.trim();
    const cleanRef = reference.trim();
    const cleanPhone = phoneNumber.trim();

    // Field validations
    if (!cleanRasId || !cleanRef || !cleanPhone) {
      setError(
        "All fields (Registry ID, Reference, and Phone Number) are required.",
      );
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      // Universal payload structured exactly to your new API contract
      const payload = {
        memberRasId: cleanRasId,
        reference: cleanRef,
        phoneNumber: cleanPhone,
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
          Universal verification gateway
        </p>

        {/* INPUT FIELDS */}
        <div className="mt-5 space-y-4">
          {/* MEMBER RAS ID */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Member Registry ID
            </label>
            <div className="relative">
              <BadgeIcon
                className="absolute left-3 top-2.5 text-zinc-400"
                sx={{ fontSize: 16 }}
              />
              <input
                type="text"
                value={memberRasId}
                onChange={(e) => setMemberRasId(e.target.value)}
                placeholder="e.g., RAS001"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <PhoneIcon
                className="absolute left-3 top-2.5 text-zinc-400"
                sx={{ fontSize: 16 }}
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 251912345678"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          {/* TRANSACTION REFERENCE */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Transaction Reference
            </label>
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-2.5 text-zinc-400"
                sx={{ fontSize: 16 }}
              />
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Telebirr / CBE Reference (e.g., FT25244MV3ZX)"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={verifyPayment}
          disabled={loading}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-black py-2 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <CircularProgress size={14} color="inherit" />
              Processing request...
            </>
          ) : (
            "Verify Transaction"
          )}
        </button>

        {/* ERROR SUMMARY */}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentVerification;
