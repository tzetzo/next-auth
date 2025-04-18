"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redirect to the home page after logout
  };

  return (
    <Button
      onClick={handleLogout}
      size="sm"
      className="px-4 py-2 bg-black font-bold text-white rounded hover:bg-gray-600 cursor-pointer"
    >
      Logout
    </Button>
  );
}
