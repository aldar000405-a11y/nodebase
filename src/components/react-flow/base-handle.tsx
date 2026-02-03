import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "!absolute !top-1/2 !-translate-y-1/2 !z-[100]",
        props.position === "left" || props.type === "target"
          ? "!-left-[2px]"
          : "!-right-[2px]",
        "!bg-black !h-[4px] !w-[4px] !rounded-full !border-none transition",
        className,
      )}
    >
      {children}
    </Handle>
  );
}
