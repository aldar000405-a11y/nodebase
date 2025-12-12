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
// import { getQueryClient, trpc } from "@/trpc/server";
// import { Client } from "./client";
// import { dehydrate } from "@tanstack/react-query";
// import { TRPCReactProvider } from "@/trpc/client";
// import { Suspense } from "react";

// export default async function Page() {
//   const queryClient = getQueryClient();

//   void queryClient.prefetchQuery(trpc.users.getUsers.queryOptions());

//   return (
//     <div>
//       <TRPCReactProvider initialState={dehydrate(queryClient)}>
//         <Suspense fallback={<p>loading...</p>}>
//            <Client />
//         </Suspense>
       
//       </TRPCReactProvider>
//     </div>
//   );
// }
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate } from "@tanstack/react-query";
import { TRPCReactProvider } from "@/trpc/client";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth.api.getSession(); // 👈 هذا هو الصحيح مع better-auth

  // 1. إذا لم يكن المستخدم مسجّل دخول → اذهب إلى /login
  if (!session?.user) {
    redirect("/login");
  }

  // 2. إذا كان مسجّل دخول → حضّر بيانات المستخدمين
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
