// "use client";

import { AuthLayout } from "@/features/auth/components/auth-layout";

// import { Children } from "react";

// import { TRPCReactProvider } from "@/trpc/client";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <TRPCReactProvider>{children}</TRPCReactProvider>;
// }

const Layout = ({children}: {children: React.ReactNode;}) => {
  return(
     <AuthLayout>
       {children}
       </AuthLayout>
     

  );
};

export default Layout;