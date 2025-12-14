// "use client";
// import { Button } from "@/components/ui/button"
// import { authClient } from '@/lib/auth-client';

// export const LogoutButton = () => {
//     return (
//     <button onClick={() => authClient.signOut()}>
//         Logout
//     </button>
//     );
// };

// "use client";

// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";

// export const LogoutButton = () => {
//   const handleLogout = async () => {
//     try {
//       await authClient.signOut(); // انتظار تسجيل الخروج
//       // إعادة التوجيه بعد تسجيل الخروج
//       window.location.href = "/login";
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return <Button onClick={handleLogout}>Logout</Button>;
// };

// "use client";

//  import { Button } from "@/components/ui/button";
//  import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/router";

//  export const LogoutButton = () => {
//   const router = useRouter();
//   return(
//     <button onClick={() => authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/login");

//         }
//       }
//     })}>
// Logout
//     </button>
//   );
//  };


"use client"; // ضروري: لأننا نستخدم useRouter و onClick

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();       // تسجيل الخروج
      router.push("/login");            // إعادة التوجيه بعد تسجيل الخروج
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};
