// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/context/AuthContext";
// import { apiRequest } from "@/lib/api";
// import { BookCard } from "@/components/BookCard";
// import { toast } from "sonner";
// import Fuse from "fuse.js";
// import { BookForm } from "@/components/BookForm";

// interface Book {
//   id: string;
//   title: string;
//   isbn: string;
//   quantity: number;
// }

// export default function BooksPage() {
//   const router = useRouter();
//   const authContext = useAuth();
//   const user = authContext?.user;
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fuse = useMemo(() => {
//     return new Fuse(books, {
//       keys: ["title", "isbn"],
//       threshold: 0.3,
//     });
//   }, [books]);

//   const filteredBooks =
//     searchQuery.trim().length > 0
//       ? fuse.search(searchQuery).map((result) => result.item)
//       : books;

//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       const data = await apiRequest("/books", "GET");
//       setBooks(data);
//     } catch {
//       toast.error("Failed to fetch books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookFormSuccess = () => {
//     fetchBooks();
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleBorrow = async (bookId: string) => {
//     if (!user?.token) {
//       toast.error("Please login first");
//       return;
//     }

//     try {
//       await apiRequest("/loans/issue", "POST", { bookId }, user.token);
//       toast.success("Book borrowed successfully!");
//       fetchBooks();
//     } catch (error: any) {
//       const errorMsg = error?.message || "Failed to borrow book";

//       toast.error(errorMsg);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!user?.token) {
//       toast.error("Unauthorized");
//       return;
//     }

//     try {
//       await apiRequest(`/books/${id}`, "DELETE", undefined, user.token);
//       toast.success("Book deleted successfully");

//       setBooks((prev) => prev.filter((b) => b.id !== id));
//     } catch (error) {
//       // console.log(error);
//       const errorMsg =
//         error instanceof Error ? error.message : "Failed to delete book";
//       toast.error(errorMsg);
//     }
//   };

//   const isAdmin = user?.role?.toUpperCase() === "ADMIN";
//   const isMember = user?.role?.toUpperCase() === "MEMBER";

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold">Books</h1>
//         {isAdmin && (
//           <BookForm token={user.token} onSuccess={handleBookFormSuccess} />
//         )}
//       </div>

//       <div className="mb-8 p-4 bg-gray-50 rounded-lg">
//         <Input
//           placeholder="Search by title or ISBN..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <div className="text-center py-12">Loading...</div>
//       ) : filteredBooks.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           No books found. Try adjusting your search.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredBooks.map((book) => (
//             <BookCard
//               key={book.id}
//               id={book.id}
//               title={book.title}
//               isbn={book.isbn}
//               quantity={book.quantity}
//               isAdmin={isAdmin}
//               isMember={isMember}
//               onBorrow={() => handleBorrow(book.id)}
//               onDelete={() => handleDelete(book.id)}
//               onEditSuccess={handleBookFormSuccess}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { BookCard } from "@/components/BookCard";
import { BookForm } from "@/components/BookForm";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  isbn: string;
  quantity: number;
}

export default function BooksPage() {
  const { user } = useAuth()!;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBooks = async (query = "") => {
    setLoading(true);
    try {
      const data = await apiRequest(
        `/books${query ? `?q=${encodeURIComponent(query)}` : ""}`,
        "GET",
      );
      setBooks(data);
    } catch {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(debouncedQuery);
  }, [debouncedQuery]);

  const handleBorrow = async (bookId: string) => {
    if (!user?.token) return toast.error("Please login first");

    try {
      await apiRequest("/loans/issue", "POST", { bookId }, user.token);
      toast.success("Book borrowed successfully!");
      fetchBooks(debouncedQuery);
    } catch (error: any) {
      toast.error(error?.message || "Failed to borrow book");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.token) return toast.error("Unauthorized");

    try {
      await apiRequest(`/books/${id}`, "DELETE", undefined, user.token);
      toast.success("Book deleted successfully");
      fetchBooks(debouncedQuery);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete book");
    }
  };

  const isAdmin = user?.role === "ADMIN";
  const isMember = user?.role === "MEMBER";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Books</h1>
        {isAdmin && (
          <BookForm
            token={user!.token}
            onSuccess={() => fetchBooks(debouncedQuery)}
          />
        )}
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <Input
          placeholder="Search by title or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No books found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              isAdmin={isAdmin}
              isMember={isMember}
              onBorrow={() => handleBorrow(book.id)}
              onDelete={() => handleDelete(book.id)}
              onEditSuccess={() => fetchBooks(debouncedQuery)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
