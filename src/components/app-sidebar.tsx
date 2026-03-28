"use client";

import { CreditCardIcon, FolderOpenIcon, LogOut, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/client";

const menuItem = [
  {
    title: "Main",
    items: [{ title: "Projects", icon: FolderOpenIcon, url: "/projects" }],
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { hasActiveSubscription, isError, isLoading } =
    useHasActiveSubscription();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const utils = trpc.useUtils();

  // Prefetch data on hover for faster navigation
  const handlePrefetch = (url: string) => {
    if (url === "/projects") {
      utils.projects.getMany.prefetch({ page: 1, pageSize: 5, search: "" });
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-slate-100 border-r-2 border-slate-300"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="gap-x-3 h-10 px-3">
                <Link href="/projects" prefetch>
                  <Image
                    src="/logos/logo.svg"
                    alt="nodebase"
                    width={20}
                    height={20}
                    className="shrink-0 min-w-[20px] min-h-[20px]"
                  />
                  <span className="font-semibold text-sm">Nodebase</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItem.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="hidden">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className="sidebar-menu-item"
                    >
                      <Link
                        href={item.url}
                        prefetch
                        onMouseEnter={() => handlePrefetch(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!isLoading && !isError && !hasActiveSubscription && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="upgrade to pro"
                className="gap-x-4 h-10 px-4"
                onClick={() => authClient.checkout({ slug: "pro" })}
              >
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="billing portal"
              className="gap-x-4 h-10 px-4"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="p-4 border-t border-[#333333] w-full overflow-hidden">
            <div className="w-full overflow-hidden">
              <span
                className="truncate w-full block text-[11px] text-gray-800"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {user?.name ?? "ADMIN_USER"}
              </span>
              <span
                className="truncate w-full block text-[10px] text-gray-600"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {user?.email ?? "-"}
              </span>
              <span
                className="truncate w-full block text-[10px] uppercase text-gray-500"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {hasActiveSubscription ? "ADMIN_USER" : "SYSTEM_OPERATOR"}
              </span>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="sign out"
              className="gap-x-4 h-10 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
