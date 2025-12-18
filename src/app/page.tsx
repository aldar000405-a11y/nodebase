



// "use client";

// import { requireAuth } from "@/lib/auth-utils";
// import { LogoutButton } from "./logout";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";
// import { Button } from "@/components/ui/button";

// const Page = () => {
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();

//   const { data } = useQuery(
//     trpc.getWorkflows.queryOptions()
//   );

//   const create = useMutation(
//     trpc.createWorkflow.mutationOptions({
//       onSuccess: () => {
//         queryClient.invalidateQueries(
//           trpc.getWorkflows.queryOptions()
//         );
//       },
//     })
//   );

//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
//       <p>protected server components</p>

//       <pre className="text-sm bg-muted p-4 rounded">
//         {JSON.stringify(data, null, 2)}
//       </pre>

//       <Button
//         disabled={create.isPending}
//         onClick={() => create.mutate()}
//       >
//         createWorkflow
//       </Button>

//       <LogoutButton />
//     </div>
//   );
// };

// export default Page;


// "use client";

// import { LogoutButton } from "./logout";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";
// import { Button } from "@/components/ui/button";

// const Page = () => {
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();

//   // const { data } = useQuery(
//   //   trpc.getWorkflows.queryOptions()
//   // );
//   const query = useQuery(
//   trpc.getWorkflows.queryOptions()
// );

//   const create = useMutation(
//     trpc.createWorkflow.mutationOptions({
//       onSuccess: () => {
//         // queryClient.invalidateQueries(
//         //   trpc.getWorkflows.queryOptions()
//         // );
//         queryClient.invalidateQueries({
//   queryKey: trpc.getWorkflows.queryKey(),
// });

//       },
//     })
//   );

//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
//       <p>protected server components</p>

//       <pre>
//           {JSON.stringify(query, null, 2)}
//       </pre>

//       <Button
//         disabled={create.isPending}
//         onClick={() => create.mutate()}
//       >
//         createWorkflow
//       </Button>

//       <LogoutButton />
//     </div>
//   );
// };

// export default Page;


"use client";
// import { LogoutButton } from "@/components/logout";
import { LogoutButton } from "../components/logout";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { CreateWorkflowButton } from "@/components/CreateWorkflowButton";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const query = useQuery(
    trpc.getWorkflows.queryOptions()
  );

  // const create = useMutation(
  //   trpc.createWorkflow.mutationOptions({
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: trpc.getWorkflows.queryKey(),
  //       });
  //     },
  //   })
  // );
  const create = useMutation(
  trpc.createWorkflow.mutationOptions({
    onSuccess: (data: any) => {
      console.log("CREATED:", data);
      queryClient.invalidateQueries({
        queryKey: trpc.getWorkflows.queryKey(),
      });
    },
    onError: (error: any) => {
      console.error("CREATE ERROR:", error);
      alert(error.message);
    },
  })
);


  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      <p>protected server components</p>

     
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
    

      
      <Button
  disabled={create.isPending}
  onClick={() => create.mutate()}
>
  {create.isPending ? "creating..." : "createWorkflow"}
</Button>


      <LogoutButton />
    </div>
  );
};

export default Page;


