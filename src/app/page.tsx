// "use client";
// import { authClient } from '@/lib/auth-client';
// import { json } from 'zod';
// import { requireAuth } from '@/lib/auth-utils';
// import { getCaller } from '@/trpc/server';
// const Page = async () => {
//   await requireAuth();

//   const data = await caller.getUsers();
//   // const { data } = authClient.useSession() 
//   return(
//     <div>
//       protected server componenets
//       {JSON.stringify(data)}
//     </div>
//   );
// };
// export default Page;
// import { requireAuth } from '@/lib/auth-utils';
// import { createCaller } from '@/trpc/server';
// import { LogoutButton } from './logout';

// const Page = async () => {
//   // تحقق من تسجيل الدخول
//   await requireAuth();

//   // إنشاء caller
//   const caller = await createCaller();

//   // جلب البيانات
//   const data = await caller.getUsers();

//   return (
//     <div>
//       <h1>Protected Server Component</h1>
//       <div>
//          {JSON.stringify(data, null, 2)}
//       </div>
//      <LogoutButton />
//     </div>
//   );
// };

// export default Page;


import { requireAuth } from "@/lib/auth-utils";
import { createCaller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async () => {
  // تحقق من تسجيل الدخول
  await requireAuth();

  // إنشاء tRPC caller
  const caller = await createCaller();

  // جلب بيانات المستخدمين
  const data = await caller.getUsers();

  return (
    <div>
      <h1>Protected Server Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* منسق للعرض */}
      <LogoutButton /> {/* Client Component داخل Server Component */}
    </div>
  );
};

export default Page;
