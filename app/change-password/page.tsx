"use client";

import { useState } from "react";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import ChangePasswordOtpForm from "@/components/ChangePasswordOtpForm";

export default function ChangePasswordPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {step === 1 && <ChangePasswordForm onSuccess={() => setStep(2)} />}

        {step === 2 && <ChangePasswordOtpForm />}
      </div>
    </div>
  );
}
