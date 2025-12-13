import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Client } from "./client";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <Suspense fallback={<p>loading...</p>}>
        <Client />
      </Suspense>
    </div>
  );
}
// import { prisma } from "@/lib/prisma";



// export default async function Page() {

//   const users = await prisma.user.findMany();



//   return (

//     <div>

//       <h1>Users</h1>

//       <pre>{JSON.stringify(users, null, 2)}</pre>

