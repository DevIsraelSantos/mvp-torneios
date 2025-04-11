import { UserListDto } from "@/app/api/dtos/users/user-list.dto";
import { UsersTable } from "@/components/users/users-table";
import { bff } from "@/lib/bff-instance";
import { CatchHandler } from "@/lib/catch-handler";

export default async function UsersPage() {
  const response = (await bff
    .get<UserListDto>("/users")
    .catch(CatchHandler)) as { data: UserListDto };

  return (
    <div className="container p-4">
      <UsersTable initialUsers={response.data?.users ?? []} />
    </div>
  );
}
