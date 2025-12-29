



"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      disabled={isLoading}
      variant="destructive"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
