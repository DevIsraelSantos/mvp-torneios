import { cn } from "@/lib/utils";

export default function Page({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background w-full h-full flex flex-col overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
