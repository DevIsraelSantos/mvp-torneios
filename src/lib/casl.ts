import { Ability, AbilityBuilder } from "@casl/ability";
import { UserRole } from "@prisma/client";

export enum RolesActions {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
}

export enum RolesSubjects {
  ALL = "all",
  MISSION = "mission",
  ACHIEVEMENT = "achievement",
  REWARD = "reward",
  REDEMPTION = "redemption",
  USER = "user",
}

export const Roles = (role?: UserRole) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (role === UserRole.ADMIN) {
    can(RolesActions.MANAGE, RolesSubjects.ALL);

    // O admin não pode conquistar missões ou resgatar prêmios
    cannot(RolesActions.CREATE, RolesSubjects.ACHIEVEMENT);
    cannot(RolesActions.CREATE, RolesSubjects.REDEMPTION);
  } else if (role === UserRole.USER) {
    cannot(RolesActions.MANAGE, RolesSubjects.ALL);
    can(RolesActions.READ, RolesSubjects.USER); // TODO - Pensar se pode ler os dados de outros usuários

    // O usuário pode visualizar missões e prêmios
    can(RolesActions.READ, RolesSubjects.MISSION);
    can(RolesActions.READ, RolesSubjects.REWARD);

    can(RolesActions.CREATE, RolesSubjects.ACHIEVEMENT);
    can(RolesActions.CREATE, RolesSubjects.REDEMPTION);
  } else {
    cannot(RolesActions.MANAGE, RolesSubjects.ALL);
    can(RolesActions.READ, RolesSubjects.MISSION);
    can(RolesActions.READ, RolesSubjects.REWARD);
  }

  return build();
};

/**
 * Dicionário de subject
 *
 * - mission: Missão
 * - reward: Prêmio
 *
 */

/**
 * Dicionário de actions
 *
 * - read: Ler
 * - create: Criar
 * - update: Atualizar
 * - delete: Deletar
 * - manage: Gerenciar
 *
 */

/**
 * Dicionário de fields
 * Obs: Field é a subcategoria de um subject
 *
 *
 */
