"use client";

import { handlers } from "@/mocks/handlers";
import { Suspense, use } from "react";

const mockingEnabledPromise =
  typeof window !== "undefined"
    ? import("@/mocks/browser").then(async ({ default: worker }) => {
        if (
          process.env.NODE_ENV === "production" ||
          process.env.NEXT_PUBLIC_MSW_ENABLED === "false"
        ) {
          return;
        }
        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes("_next") || request.url.includes("_rsc")) {
              return;
            }
            print.warning();
          },
        });
        worker.use(...handlers);
        console.log(worker.listHandlers());
      })
    : Promise.resolve();

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If MSW is enabled, we need to wait for the worker to start,
  // so we wrap the children in a Suspense boundary until it's ready.
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  use(mockingEnabledPromise);
  return children;
}
