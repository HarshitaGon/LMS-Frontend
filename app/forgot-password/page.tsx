"use client";

import { useState } from "react";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import OtpForm from "@/components/OtpForm";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {step === 1 && (
          <ForgotPasswordForm
            onSuccess={(email) => {
              setEmail(email);
              setStep(2);
            }}
          />
        )}

        {step === 2 && <OtpForm email={email} onSuccess={() => setStep(3)} />}

        {step === 3 && <ResetPasswordForm email={email} />}
      </div>
    </div>
  );
}
