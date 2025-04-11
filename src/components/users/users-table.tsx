"use client";

import { MessageDto } from "@/app/api/dtos/message.dto";
import { UserPartialProps } from "@/app/api/dtos/users/user-partial.dto";
import { UserPayloadProps } from "@/app/api/dtos/users/user-payload.dto";
import { UserDto } from "@/app/api/dtos/users/user.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bff } from "@/lib/bff-instance";
import { UserRole } from "@prisma/client";
import { AxiosError } from "axios";
import { Ban, Info, MoreVertical, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CatchHandler } from "@/lib/catch-handler";

function SendProcessingAlert() {
  toast("⌛ Processando...");
}

export function UsersTable({ initialUsers }: { initialUsers: UserDto[] }) {
  const [users, setUsers] = useState<UserDto[]>(initialUsers);
  const [filters, setFilters] = useState<{
    search: string;
    onlyActive: boolean;
    onlyAdmin: boolean;
    onlyUser: boolean;
    onlyInactive: boolean;
  }>({
    search: "",
    onlyActive: false,
    onlyAdmin: false,
    onlyUser: false,
    onlyInactive: false,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const handleCreateUser = async (
    user: UserPayloadProps,
    setIsloading: (value: boolean) => void
  ) => {
    setIsloading(true);
    try {
      const { data } = await bff.post<UserDto>("/users", user);

      const newUser = data;

      toast(`Usuário ${newUser.name} criado com sucesso!`);

      setUsers((prevUsers) => [...prevUsers, newUser]);
      setCreateDialogOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        CatchHandler(error);
        const { response } = error;

        if (response?.status === 400) {
          toast(response.data.message);
        }
      }
    }
    setIsloading(false);
  };

  const handleEditUser = async (id: string, updatedUser: UserPartialProps) => {
    try {
      const { data } = await bff.patch<UserDto>(`/users/${id}`, updatedUser);

      toast(`Usuário ${data.name} atualizado!`);

      setUsers(users.map((user) => (user.id === id ? data : user)));
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        CatchHandler(error);
        const { response } = error;

        if (response?.status === 400) {
          toast(response.data.message);
        }
      }
    }
  };

  const openEditDialog = (user: UserDto) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handlerDisableUser = async (userId: string) => {
    SendProcessingAlert();
    try {
      const { data } = await bff.delete<MessageDto>(`/users/${userId}`);

      toast(data.message);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: false } : user
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        CatchHandler(error);
        const { response } = error;

        toast(response?.data.message || "Erro ao inativar usuário.");
      }
    }
  };

  const handlerEnableUser = async (userId: string) => {
    SendProcessingAlert();
    try {
      const { data } = await bff.post<MessageDto>(`/users/${userId}`);

      toast(data.message);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: true } : user
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        CatchHandler(error);
        const { response } = error;

        toast(response?.data.message || "Erro ao ativar usuário.");
      }
    }
  };

  const userDatasets = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.onlyActive ? user.isActive : true) &&
      (filters.onlyInactive ? !user.isActive : true) &&
      (filters.onlyAdmin ? user.role === UserRole.ADMIN : true) &&
      (filters.onlyUser ? user.role === UserRole.USER : true)
    );
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Usuários da Organização</h2>
        <div className="flex items-end gap-4">
          <Select
            onValueChange={(value) => {
              const onlyActive = value === "active";
              const onlyInactive = value === "inactive";
              setFilters({ ...filters, onlyActive, onlyInactive });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => {
              const onlyAdmin = value === "admin";
              const onlyUser = value === "user";
              setFilters({ ...filters, onlyAdmin, onlyUser });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Função</SelectLabel>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Colaborador</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder="Pesquisar"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            value={filters.search}
            className="w-64"
          />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userDatasets.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === UserRole.ADMIN ? "default" : "secondary"
                    }
                  >
                    {user.role === UserRole.ADMIN
                      ? "Administrador"
                      : "Colaborador"}
                  </Badge>
                </TableCell>
                <TableCell>{user.points.toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {user.isActive ? (
                        <DropdownMenuItem
                          onClick={() => handlerDisableUser(user.id)}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Inativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handlerEnableUser(user.id)}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateUser}
      />

      {selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={selectedUser}
          onSubmit={handleEditUser}
        />
      )}
    </div>
  );
}
