// "use client";

import { AppHeader } from "@/components/app-header";

// import { Suspense } from "react";
// import { SidebarLayout } from "./sidebar-layout";

// const Layout = ({ children }: { children: React.ReactNode;}) => {
//     return (
//         <Suspense fallback={null}>
//             <SidebarLayout>{children}</SidebarLayout>
//         </Suspense>
//     );
// };

// export default Layout;



const Layout = ({ children }: { children: React.ReactNode;}) => {
    return (
        <>
        <AppHeader />
          <main  className="flex-1">{children}</main> 
        </>


    );
};

export default Layout;