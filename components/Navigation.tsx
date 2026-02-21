"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

export function Navigation() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const logout = authContext?.logout;

  const handleLogout = () => {
    if (logout) {
      logout();
      router.push("/login");
    }
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Home */}
          <Link href="/" className="text-2xl font-bold">
            📚 LMS
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {/* Public Links */}
                <Link href="/books" className="hover:text-slate-200">
                  Books
                </Link>

                {/* Member Links */}
                {user.role?.toUpperCase() === "MEMBER" && (
                  <Link href="/loans" className="hover:text-slate-200">
                    My Loans
                  </Link>
                )}

                {/* Admin Links */}
                {user.role?.toUpperCase() === "ADMIN" && (
                  <>
                    {/* <Link href="/books/create" className="hover:text-slate-200">
                      Add Book
                    </Link> */}
                    <Link href="/admin/loans" className="hover:text-slate-200">
                      All Loans
                    </Link>
                    <Link href="/admin/users" className="hover:text-slate-200">
                      Users
                    </Link>
                  </>
                )}

                {/* Profile & Logout */}
                <Link href="/profile" className="hover:text-slate-200">
                  Profile
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-black border-white hover:bg-slate-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-slate-200">
                  Login
                </Link>
                <Link href="/register" className="hover:text-slate-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
