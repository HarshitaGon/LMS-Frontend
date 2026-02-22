"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const authContext = useAuth();
  const login = authContext?.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", "POST", {
        email,
        password,
      });

      if (data?.accessToken) {
        if (login) {
          login({
            name: data.name,
            email: data.email || email,
            role: (data.role || "MEMBER").toUpperCase(),
            token: data.accessToken,
          });
        }
        toast.success(
          `Welcome ${data.role?.toUpperCase() === "ADMIN" ? "Admin" : "Member"}!`,
        );
        router.push("/books");
      } else {
        toast.error("Login failed: No access token received");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Login failed";

      // Provide user-friendly error messages
      let displayMessage = errorMsg;
      if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
        displayMessage = "Invalid email or password";
      } else if (errorMsg.includes("400") || errorMsg.includes("validation")) {
        displayMessage = "Please check your email and password format";
      }

      toast.error(displayMessage || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">📚 Login</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form> */}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* ✅ Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Register here
              </Link>
            </p>

            <div className="bg-blue-50 p-3 rounded-lg text-xs">
              <p className="font-semibold text-blue-900 mb-2">
                Demo Credentials:
              </p>
              <p className="text-blue-800">
                <strong>Admin:</strong> admin@library.com / admin123
              </p>
              <p className="text-blue-800">
                <strong>Member:</strong> Register a new account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
