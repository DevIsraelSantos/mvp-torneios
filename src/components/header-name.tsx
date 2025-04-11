import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function HeaderName({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className={cn("text-2xl font-semibold", className)}>{children}</span>
  );
}
