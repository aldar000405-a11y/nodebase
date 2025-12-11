// import { caller } from "@/trpc/server";

// export default async function Page() {
//   const users = await caller.users.getUsers();

//   return (
//     <div>
//       {JSON.stringify(users)}
//     </div>
//   );
// }

// import { prisma } from "@/lib/prisma";

// export default async function Page() {
//   const users = await prisma.user.findMany();

//   return (
//     <div>
//       <h1>Users</h1>
//       <pre>{JSON.stringify(users, null, 2)}</pre>
//     </div>
//   );
// }







// import { prisma } from "@/lib/prisma";
import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate } from "@tanstack/react-query";
import { TRPCReactProvider } from "@/trpc/client";
import { Suspense } from "react";

export default async function Page() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getUsers.queryOptions());

  return (
    <div>
      <TRPCReactProvider initialState={dehydrate(queryClient)}>
        <Suspense fallback={<p>loading...</p>}>
           <Client />
        </Suspense>
       
      </TRPCReactProvider>
    </div>
  );
}
