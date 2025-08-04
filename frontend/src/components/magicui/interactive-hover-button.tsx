import React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SLOW_TRANSITION = "transition-all duration-390";

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-[100.8]", SLOW_TRANSITION)}></div>
        {/* Hide the original text visually when hovered to prevent shadow/ghosting */}
        <span
          className={cn(
            "inline-block",
            SLOW_TRANSITION,
            // Hide the text completely when hovered, not just opacity/translate
            "group-hover:invisible"
          )}
        >
          {children}
        </span>
      </div>
      <div
        className={cn(
          "absolute top-0 z-10 flex h-full w-full translate-x-1 items-center justify-center gap-2 text-primary-foreground opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:-translate-x-5 group-hover:opacity-100",
          SLOW_TRANSITION
        )}
      >
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
