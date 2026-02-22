"use client";

import { useState } from "react";
import { requestChangePassword } from "@/lib/api";

export default function ChangePasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestChangePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      alert("OTP sent to your email");
      onSuccess();
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        className="w-full border p-2 rounded"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

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
        placeholder="Confirm New Password"
        className="w-full border p-2 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {loading ? "Sending OTP..." : "Submit"}
      </button>
    </form>
  );
}
