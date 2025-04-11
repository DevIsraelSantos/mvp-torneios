import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

// export const PointsIcon = Star;

export const PointsIcon = ({
  className,
  ...props
}: {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => {
  return <Star className={cn("text-yellow-500", className)} {...props} />;
};
