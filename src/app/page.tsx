

// export default Page;
// "use client"
// import { requireAuth } from "@/lib/auth-utils";
// import { LogoutButton } from "./logout";
// import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";
// import { Button } from "@/components/ui/button";

// const Page =  () => {
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();
// const { data } = useQuery(trpc.getWorkflows.queryOptions());
// const create = useMutation(trpc.createWorkflow.mutationOptions({
//   onSuccess: () => {
//     queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())

//   }
// }));
 

//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
//       protected server componenets
//       <div>
//         {JSON.stringify(data, null, 2)}
//       </div>
//       <Button disabled={create.isPending} onClick={() => create.mutate()}>
//         createWorkflow
//       </Button>
//       <LogoutButton />

//     </div>
//   );
// };
// export default Page;

"use client";

import { trpc } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout";

export default function Page() {
  const queryClient = useQueryClient();

  const { data = [] } = trpc.getWorkflows.useQuery(undefined, {
    initialData: [],
  });

  const create = trpc.createWorkflow.useMutation({
    onSuccess: () => queryClient.invalidateQueries(trpc.getWorkflows.getKey()),
  });

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <h1>Protected Client Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Button disabled={create.isLoading} onClick={() => create.mutate()}>
        createWorkflow
      </Button>
      <LogoutButton />
    </div>
  );
}
