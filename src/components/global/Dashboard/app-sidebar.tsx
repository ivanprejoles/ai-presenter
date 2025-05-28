"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { useParams } from "next/navigation";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["userAndFiles", user?.id],
    queryFn: () =>
      fetchQuery(api.file.getUserWithFiles, {
        userId: user?.id as string,
      }),
    enabled: isLoaded && !!user?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const files = {
    navMain: [
      {
        title: "Presentations",
        url: "/dashboard",
        items: data?.files,
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {files.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={item._id === id}
                        >
                          <a href={`/dashboard/${item._id}`}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
            {/* For "No files found" message */}
            {files.navMain.some((item) => !item.items?.length) && (
              <SidebarMenu>
                <p className="text-slate-500 ml-3 text-sm">No files found</p>
              </SidebarMenu>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
