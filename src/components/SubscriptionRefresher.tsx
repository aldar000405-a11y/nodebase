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
      // Invalidate both the old subscription key and the tRPC premium status query
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      // Invalidate the tRPC query for premium status (matches the query key pattern used by tRPC)
      queryClient.invalidateQueries({ queryKey: [["users", "getPremiumStatus"]] });
      // Also refetch all queries that might depend on premium status
      queryClient.refetchQueries({ queryKey: [["users", "getPremiumStatus"]] });
      toast.success("Subscription updated successfully!");

      // Clean up the URL to prevent re-triggering on subsequent navigations
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("upgradeSuccess");
      window.history.replaceState({}, document.title, newUrl.toString());
    }
  }, [searchParams, queryClient]);

  return null; // This component doesn't render anything
};
