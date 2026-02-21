"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoanCardProps {
  bookTitle: string;
  userName?: string;
  issuedAt: string;
  returnedAt?: string | null;
  onReturn?: () => void;
  isOwner?: boolean;
}

export function LoanCard({
  bookTitle,
  userName,
  issuedAt,
  returnedAt,
  onReturn,
  isOwner = false,
}: LoanCardProps) {
  const issuedDate = new Date(issuedAt);
  const returnedDate = returnedAt ? new Date(returnedAt) : null;
  const isReturned = !!returnedAt;

  const calculateDaysOut = () => {
    const now = new Date();
    return Math.floor(
      (now.getTime() - issuedDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  };
  const daysOut = calculateDaysOut();

  return (
    <Card className={isReturned ? "opacity-75" : "hover:shadow-lg"}>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-start">
          <span>{bookTitle}</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              isReturned
                ? "bg-gray-200 text-gray-800"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            {isReturned ? "Returned" : "Active"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {userName && (
            <p>
              <strong>Borrower:</strong> {userName}
            </p>
          )}
          <p>
            <strong>Issued:</strong> {issuedDate.toLocaleDateString()}
          </p>
          {isReturned && (
            <p>
              <strong>Returned:</strong> {returnedDate?.toLocaleDateString()}
            </p>
          )}
          {!isReturned && (
            <p className="text-gray-600">
              <strong>Days Out:</strong> {daysOut} day{daysOut !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!isReturned && isOwner && (
          <Button onClick={onReturn} className="w-full" variant="default">
            Return Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
