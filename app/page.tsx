"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { AdminDashboard } from "@/components/AdminDashboard";
// import MemberDashboard from "./memberDashboard/page";

export default function Home() {
  const authContext = useAuth();
  const user = authContext?.user;
  const router = useRouter();

  useEffect(() => {
    if (authContext && !user) {
      router.push("/login");
    }
  }, [authContext, user, router]);

  // Show admin dashboard for ADMIN role
  // if (user && user.role?.toUpperCase() === "ADMIN") {
  //   return <AdminDashboard token={user.token} />;
  // }

  // Show member dashboard for MEMBER role
  // if (user && user.role?.toUpperCase() === "MEMBER") {
  //   return <MemberDashboard />;
  // }

  // Unauthenticated landing page
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-slate-50 to-slate-100 px-4">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 text-center">
            📚 Library Management System
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-center">
            Your complete solution for managing library books and loans. Browse
            our collection, borrow books, and track your reading journey.
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Button
              onClick={() => router.push("/login")}
              className="text-lg px-8 py-6
               transition-all duration-300 ease-in-out
               hover:-translate-y-1 hover:shadow-lg
               active:translate-y-0"
            >
              Login
            </Button>

            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="text-lg px-8 py-6
               transition-all duration-300 ease-in-out
               hover:-translate-y-1 hover:shadow-lg
               hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-600
               active:translate-y-0"
            >
              Register
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          <div
            className="bg-white p-6 rounded-lg shadow-md
               transition-all duration-300 ease-in-out
               hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-3xl mb-3 transition-transform duration-300">
              📖
            </div>
            <h3 className="font-bold text-lg mb-2">Browse Books</h3>
            <p className="text-gray-600">
              Explore our extensive collection of books with powerful search
              capabilities.
            </p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow-md
               transition-all duration-300 ease-in-out
               hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-3xl mb-3 transition-transform duration-300">
              🚀
            </div>
            <h3 className="font-bold text-lg mb-2">Borrow Books</h3>
            <p className="text-gray-600">
              Easily borrow books and track all your loans in one place.
            </p>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow-md
               transition-all duration-300 ease-in-out
               hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-3xl mb-3 transition-transform duration-300">
              ⚙️
            </div>
            <h3 className="font-bold text-lg mb-2">Manage Library</h3>
            <p className="text-gray-600">
              Admins can manage books, users, and monitor all active loans.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
