"use client";

import { useState } from "react";
import { confirmChangePassword } from "@/lib/api";

export default function ChangePasswordOtpForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmChangePassword(otp);
      alert("Password changed successfully!");
      window.location.href = "/dashboard/member";
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Enter OTP</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full border p-2 rounded"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        {loading ? "Verifying..." : "Verify & Change Password"}
      </button>
    </form>
  );
}
