"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, SquarePen } from "lucide-react";

interface BookFormProps {
  bookId?: string;
  token?: string;
  isEdit?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function BookForm({
  bookId,
  token,
  isEdit = false,
  onClose,
  onSuccess,
}: BookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    quantity: 1,
  });

  // useEffect(() => {
  //   if (isEdit && bookId && token) {
  //     fetchBook();
  //   }
  // }, [isEdit, bookId, token]);

  const fetchBook = async () => {
    try {
      const book = await apiRequest(`/books/${bookId}`, "GET");
      setFormData({
        title: book.title,
        isbn: book.isbn,
        quantity: book.quantity,
      });
    } catch {
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!formData.title.trim() || !formData.isbn.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && bookId) {
        await apiRequest(`/books/${bookId}`, "PATCH", formData, token);
        toast.success("Book updated successfully");
      } else {
        console.log(token);
        await apiRequest("/books", "POST", formData, token);
        toast.success("Book created successfully");
      }
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      } else {
        router.push("/books");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save book";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            {isEdit ? (
              <div className="flex gap-2 justify-center items-center">
                <SquarePen />
                <p>Edit</p>
              </div>
            ) : (
              <div className="flex gap-2 justify-center items-center">
                <Plus />
                <p>Add Book</p>
              </div>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add a book </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Book Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                ISBN <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                disabled={isEdit}
                required
              />
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">
                  ISBN cannot be changed for existing books
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? (
                  "Saving..."
                ) : isEdit ? (
                  "Update Book"
                ) : (
                  <div className="flex gap-2 justify-center items-center">
                    <Plus />
                    <p>Add Book</p>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
