import {
   QueryClient ,
   defaultShouldDehydrateQuery
  } from "@tanstack/react-query";
  import SuperJSON from "superjson";


export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - data is fresh, no refetch
        gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
        refetchOnMount: false, // Don't refetch if data exists in cache
        refetchOnWindowFocus: false, // Don't refetch on tab switch
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
         query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,

      },
    },
  });
}
