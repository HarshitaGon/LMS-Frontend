"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordForm({ email }: { email: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email, newPassword, confirmPassword);
      alert("Password reset successful!");
      window.location.href = "/login";
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        className="w-full border p-2 rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border p-2 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
      >
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </form>
  );
}
