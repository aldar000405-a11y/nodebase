import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/trpc/client"; // Import trpc client
// import { authClient } from "@/lib/auth-client"; // No longer needed for this hook

// This hook is no longer directly used for active subscription status,
// but can remain if other parts of the app need the full customer state.
// For now, we'll keep it, but focus on useHasActiveSubscription
export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      // If authClient.customer.state() is still needed for other data, keep this.
      // Otherwise, this hook might be deprecated or refactored further.
      // For now, returning null to show it's not the primary source for hasActiveSubscription
      return null; // authClient.customer.state() is no longer main source for premium status
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data, isLoading, ...rest } = trpc.users.getPremiumStatus.useQuery(); // Use tRPC query
  const hasActiveSubscription = data?.hasPremium || false; // Extract hasPremium

  return {
    hasActiveSubscription,
    // subscription: customerState?.activeSubscriptions?.[0], // No longer directly available here
    isLoading,
    ...rest,
  };
};
