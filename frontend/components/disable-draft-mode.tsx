"use client";

import { useTransition } from "react";
import { useIsPresentationTool } from "next-sanity/hooks";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { disableDraftMode } from "@/app/actions/disable-draft-mode";

export function DisableDraftMode() {
  const [pending, startTransition] = useTransition();
  const isPresentationTool = useIsPresentationTool();
  const isInIframe =
    typeof window !== "undefined" && window.self !== window.top;

  // Hide when inside Presentation Tool or any Studio iframe pane
  if (isPresentationTool || isInIframe) return null;

  return (
    <button
      className={cn(
        buttonVariants({ size: "lg" }),
        "fixed z-9999 bottom-4 right-4 cursor-pointer",
      )}
      disabled={pending}
      onClick={() => startTransition(() => disableDraftMode())}
    >
      {pending ? "Disabling..." : "Disable Draft Mode"}
    </button>
  );
}
