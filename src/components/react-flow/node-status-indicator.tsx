import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";

export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
  className?: string;
};

export const SpinnerLoadingIndicator = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      <StatusBorder className="border-blue-700">{children}</StatusBorder>

      <div className="bg-background/50 absolute inset-0 z-50 rounded-[9px] backdrop-blur-xs" />
      <div className="absolute inset-0 z-50">
        <span className="absolute top-[calc(50%-1.25rem)] left-[calc(50%-1.25rem)] inline-block h-10 w-10 animate-ping rounded-full bg-blue-700/30" />

        <LoaderCircle className="absolute top-[calc(50%-0.75rem)] left-[calc(50%-0.75rem)] size-6 animate-spin text-blue-700" />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative rounded-sm">
      {children}
      <div className="absolute -inset-[1px] h-[calc(100%+2px)] w-[calc(100%+2px)] z-50 pointer-events-none">
        <style>
          {`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 140%;
          aspect-ratio: 1;
          transform-origin: center;
        }
      `}
        </style>
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-sm border-[3px] border-blue-700/50",
            className,
          )}
        >
          <div className="spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(29,78,216,1)_0deg,rgba(37,99,235,0.7)_180deg,rgba(29,78,216,0)_360deg)] opacity-100" />
        </div>
      </div>
    </div>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative rounded-sm">
      {children}
      {/* Sharp border only - rendered after children to be on top */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-[1px] z-50 rounded-sm border-[1.5px]",
          className,
        )}
      />
    </div>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
  className,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      switch (variant) {
        case "overlay":
          return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
        case "border":
          return (
            <BorderLoadingIndicator className={className}>
              {children}
            </BorderLoadingIndicator>
          );
        default:
          return <>{children}</>;
      }
    case "success":
      return (
        <StatusBorder
          className={cn("border-green-600", className)}
        >
          {children}
        </StatusBorder>
      );
    case "error":
      return (
        <StatusBorder
          className={cn("border-red-600", className)}
        >
          {children}
        </StatusBorder>
      );
    default:
      return <>{children}</>;
  }
};
