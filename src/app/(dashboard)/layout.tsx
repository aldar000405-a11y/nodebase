// "use client";

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

import {AppSidebar} from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode;}) => {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="w-full overflow-auto">
                {children}
            </SidebarInset>

        </SidebarProvider>
    );
};

export default Layout;