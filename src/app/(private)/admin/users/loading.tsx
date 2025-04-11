import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUsersPage() {
  return (
    <div className="container p-4 flex flex-col gap-4">
      <div className="w-full inline-flex justify-between items-center">
        <Skeleton className="w-52 h-8" />
        <Skeleton className="w-40 h-10" />
      </div>
      <Skeleton className="w-full p-4 flex flex-col gap-6">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-8" />
      </Skeleton>
    </div>
  );
}
