"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Loan {
  id: string;
  userId: string;
  bookId: string;
  issuedAt: string;
  returnedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
    isbn: string;
  };
}

export default function AdminLoansPage() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/books");
      return;
    }

    fetchLoans();
  }, [user, router]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      if (!user?.token) {
        toast.error("Not authenticated");
        return;
      }
      const data = await apiRequest(
        "/loans/active",
        "GET",
        undefined,
        user.token,
      );
      setLoans(data);
    } catch {
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
    return <div className="text-center py-12">Access Denied</div>;
  }

  const activeLoans = loans.filter((loan) => !loan.returnedAt);
  const returnedLoans = loans.filter((loan) => loan.returnedAt);
  const filteredLoans = filter === "active" ? activeLoans : loans;

  const stats = {
    totalLoans: loans.length,
    activeLoans: activeLoans.length,
    returnedLoans: returnedLoans.length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Loan Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Loans</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalLoans}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.activeLoans}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Returned</p>
            <p className="text-3xl font-bold text-gray-600">
              {stats.returnedLoans}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Active Loans ({activeLoans.length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          All Loans ({loans.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredLoans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {filter === "active" ? "No active loans." : "No loans yet."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">
                  Book Title
                </th>
                <th className="px-6 py-3 text-left font-semibold">ISBN</th>
                <th className="px-6 py-3 text-left font-semibold">Borrower</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Issued Date
                </th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                {filter === "all" && (
                  <th className="px-6 py-3 text-left font-semibold">
                    Returned Date
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const issuedDate = new Date(loan.issuedAt);
                const returnedDate = loan.returnedAt
                  ? new Date(loan.returnedAt)
                  : null;
                const daysOut = Math.floor(
                  (Date.now() - issuedDate.getTime()) / (1000 * 60 * 60 * 24),
                );

                return (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">
                      {loan.book.title}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {loan.book.isbn}
                    </td>
                    <td className="px-6 py-4">{loan.user.name}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {loan.user.email}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {issuedDate.toLocaleDateString()}
                      <br />
                      <span className="text-gray-600">
                        ({daysOut} day{daysOut !== 1 ? "s" : ""} ago)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          loan.returnedAt
                            ? "bg-gray-200 text-gray-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {loan.returnedAt ? "Returned" : "Active"}
                      </span>
                    </td>
                    {filter === "all" && (
                      <td className="px-6 py-4 text-xs">
                        {returnedDate ? returnedDate.toLocaleDateString() : "-"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
