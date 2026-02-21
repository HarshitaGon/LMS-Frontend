"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { BookForm } from "@/components/BookForm";
import { useEffect } from "react";

export default function EditBookPage() {
  const authContext = useAuth();
  const user = authContext?.user;
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/books");
    }
  }, [user, router]);

  if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
    return <div className="text-center py-12">Access denied</div>;
  }

  return <BookForm bookId={bookId} token={user.token} isEdit={true} />;
}
