// src/components/SubscriptionRefresher.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const SubscriptionRefresher = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Assuming Polar.sh redirects back with a specific query parameter on success
    // Example: /dashboard?upgradeSuccess=true
    if (searchParams.get("upgradeSuccess") === "true") {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Subscription updated successfully!");

      // Clean up the URL to prevent re-triggering on subsequent navigations
      // This requires some careful handling as `router.replace` with `searchParams` can be tricky
      // Using window.history.replaceState for direct DOM manipulation.
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("upgradeSuccess");
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [searchParams, queryClient]);

  return null; // This component doesn't render anything
};
