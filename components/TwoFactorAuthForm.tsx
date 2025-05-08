"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { activate2FA, get2FAsecret, deactivate2FA } from "@/actions";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface TwoFactorAuthFormProps {
  twoFactorActivated: boolean;
}

export default function TwoFactorAuthForm({
  twoFactorActivated,
}: TwoFactorAuthFormProps) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [otp, setOtp] = useState("");

  const handleEnable2FA = async () => {
    try {
      const { secret } = await get2FAsecret();
      setStep(2);
      setCode(secret);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "An error occurred while enabling 2FA");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await activate2FA(otp);
      toast.success("Two-factor authentication activated successfully");
      setIsActivated(true);
      setStep(1);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "An error occurred while activating 2FA");
    }
    setOtp("");
    setCode("");
  };

  const handleDisable2FA = async () => {
    // call the server action to disable 2FA
    try {
      await deactivate2FA();
      toast.success("Two-factor authentication deactivated successfully");
      setIsActivated(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "An error occurred while disabling 2FA");
    }
  };

  return (
    <>
      {!isActivated ? (
        <div className="text-muted-foreground">
          {step === 1 && (
            <Button onClick={handleEnable2FA} className="w-full my-2">
              Enable Two Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="text-xs text-muted-foreground py-2">
                Scan the QR Code below in the Google Authenticator app to
                activate Two-factor Authentication
              </p>
              <QRCodeSVG value={code} />
              <Button onClick={() => setStep(3)} className="w-full my-2">
                I have scanned the QR Code
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full my-2"
              >
                Cancel
              </Button>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Please enter the one time passcode from the Google Authenticator
                app.
              </p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" disabled={otp.length !== 6}>
                Submit and activate
              </Button>
              <Button variant="outline" onClick={() => setStep(2)}>
                Cancel
              </Button>
            </form>
          )}
        </div>
      ) : (
        <Button variant="destructive" onClick={handleDisable2FA}>
          Disable Two Factor Authentication
        </Button>
      )}
    </>
  );
}
