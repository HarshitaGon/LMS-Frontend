"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { LoanCard } from "@/components/LoanCard";
import { toast } from "sonner";

interface Loan {
  id: string;
  bookId: string;
  userId: string;
  issuedAt: string;
  returnedAt: string | null;
  book: {
    id: string;
    title: string;
    isbn: string;
  };
}

export default function LoansPage() {
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
        "/loans/my-loans",
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

  const handleReturn = async (loanId: string) => {
    try {
      if (!user?.token) {
        toast.error("Not authenticated");
        return;
      }
      await apiRequest(`/loans/return/${loanId}`, "POST", {}, user.token);
      toast.success("Book returned successfully!");
      fetchLoans();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to return book";
      toast.error(errorMsg);
    }
  };

  const filteredLoans =
    filter === "active" ? loans.filter((loan) => !loan.returnedAt) : loans;

  if (!user) {
    return <div className="text-center py-12">Redirecting...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Loans</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Active ({loans.filter((l) => !l.returnedAt).length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          All ({loans.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredLoans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {filter === "active"
            ? "You have no active loans. Start borrowing books!"
            : "No loan history yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              bookTitle={loan.book.title}
              issuedAt={loan.issuedAt}
              returnedAt={loan.returnedAt}
              isOwner={true}
              onReturn={() => handleReturn(loan.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
