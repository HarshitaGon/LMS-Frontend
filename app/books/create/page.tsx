// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { BookForm } from "@/components/BookForm";
// import { useEffect } from "react";

// export default function CreateBookPage() {
//   const authContext = useAuth();
//   const user = authContext?.user;
//   const router = useRouter();

//   useEffect(() => {
//     if (user && user.role !== "ADMIN" && user.role !== "admin") {
//       router.push("/books");
//     }
//   }, [user, router]);

//   if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
//     return <div className="text-center py-12">Access denied</div>;
//   }

//   return <BookForm token={user.token} />;
// }
