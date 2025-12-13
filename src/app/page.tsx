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

