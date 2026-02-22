const API = process.env.NEXT_PUBLIC_API_URL || "";
import { getToken } from "./auth";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>,
  token?: string,
) {
  const url = `${API}${endpoint}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }

    if (!res.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        text ||
        res.statusText ||
        "Request failed";
      const error = new Error(errorMessage);
      (error as any).status = res.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Unable to connect to server");
  }
}

const BASE_URL = "http://localhost:3000/auth"; // your Nest backend

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Failed to send OTP");
  return res.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) throw new Error("Invalid OTP");
  return res.json();
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword, confirmPassword }),
  });

  if (!res.ok) throw new Error("Password reset failed");
  return res.json();
};

export const requestChangePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
  });

  if (!res.ok) throw new Error("Failed to send OTP");
  return res.json();
};

export const confirmChangePassword = async (otp: string) => {
  const res = await fetch(`${BASE_URL}/confirm-change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ otp }),
  });

  if (!res.ok) throw new Error("Invalid OTP");
  return res.json();
};
