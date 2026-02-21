"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookForm } from "./BookForm";
import { useAuth } from "@/context/AuthContext";
import { Trash } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  isbn: string;
  quantity: number;
  isAdmin?: boolean;
  isMember?: boolean;
  onBorrow?: () => void;
  onDelete?: () => void;
  onEditSuccess?: () => void;
}

export function BookCard({
  id,
  title,
  isbn,
  quantity,
  isAdmin = false,
  isMember = false,
  onBorrow,
  onDelete,
  onEditSuccess,
}: BookCardProps) {
  const isAvailable = quantity > 0;
  const authContext = useAuth();
  const user = authContext?.user;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>ISBN:</strong> {isbn}
          </p>
          <p
            className={`text-sm font-semibold ${isAvailable ? "text-green-600" : "text-red-600"}`}
          >
            {isAvailable ? `✓ Available (${quantity})` : "Out of Stock"}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {isMember && (
            <Button
              onClick={onBorrow}
              disabled={!isAvailable}
              className="flex-1"
              variant={isAvailable ? "default" : "outline"}
            >
              {isAvailable ? "Borrow" : "Unavailable"}
            </Button>
          )}

          {isAdmin && (
            <>
              <BookForm
                isEdit={true}
                bookId={id}
                token={user?.token}
                onSuccess={onEditSuccess}
              />
              <Button
                onClick={onDelete}
                variant="destructive"
                className="flex-1  bg-red-500"
              >
                <div className="flex gap-2 justify-center items-center">
                  <Trash />
                  <p>Delete</p>
                </div>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
