import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
  column,
}: {
  children: React.ReactNode;
  className?: string;
  column?: boolean;
}) {
  return (
    <div
      className={cn(
        `max-w-[1500px] m-auto h-full w-full px-4 lg:px-6 inline-flex justify-between items-center`,
        column ? "flex-col" : "",
        className
      )}
    >
      {children}
    </div>
  );
}
