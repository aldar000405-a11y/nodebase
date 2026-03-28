import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/trpc/client"; // Import trpc client

// This hook is no longer directly used for active subscription status,
// but can remain if other parts of the app need the full customer state.
export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      return null;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data, isLoading, ...rest } = trpc.users.getPremiumStatus.useQuery(
    undefined,
    {
      // Refetch every 5 minutes to detect subscription expiration
      refetchInterval: 5 * 60 * 1000,
      // Consider data stale after 1 minute
      staleTime: 60 * 1000,
      // Refetch when window regains focus (e.g. after returning from Polar checkout)
      refetchOnWindowFocus: true,
    },
  );
  const hasActiveSubscription = data?.hasPremium || false;

  return {
    hasActiveSubscription,
    isLoading,
    ...rest,
  };
};
