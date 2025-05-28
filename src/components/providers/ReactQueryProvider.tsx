// app/ConvexClientProvider.tsx (for App Router)
"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { useState, ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

function ConvexClientProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Load PDF.js
    const pdfScript = document.createElement("script");
    pdfScript.type = "module";
    pdfScript.src = "/pdfjs/pdf.mjs";
    document.body.appendChild(pdfScript);
    // Optional: cleanup if needed
    return () => {
      document.body.removeChild(pdfScript);
    };
  }, []);

  const [{ convex, queryClient }] = useState(() => {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const convexQueryClient = new ConvexQueryClient(convex);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          queryKeyHashFn: convexQueryClient.hashFn(),
          queryFn: convexQueryClient.queryFn(),
        },
      },
    });

    convexQueryClient.connect(queryClient);

    return {
      convex,
      queryClient,
    };
  });

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProviderWithClerk>
  );
}

export default ConvexClientProvider;
