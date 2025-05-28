import { AppSidebar } from "@/components/global/Dashboard/app-sidebar";
import { SiteHeader } from "@/components/global/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { QueryClient } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const queryClient = new QueryClient();
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const userInfo = {
    name: user.firstName,
    email: user.emailAddresses[0]?.emailAddress,
    picture: user.imageUrl,
    userId: user.id,
  };

  await fetchMutation(api.user.createUser, {
    name: userInfo.name as string,
    email: userInfo.email as string,
    picture: userInfo.picture as string,
    userId: userInfo.userId as string,
  });

  // Server-side function
  const userData = await fetchQuery(api.file.getUserWithFiles, {
    userId: user.id,
  });

  // If you need to hydrate this data into your client-side state:
  await queryClient.prefetchQuery({
    queryKey: ["userAndFiles", user.id],
    queryFn: () => userData,
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          ))} */}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
