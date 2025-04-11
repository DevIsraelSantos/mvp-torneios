import { UserRole } from "@prisma/client";

export interface UserPayloadProps {
  name: string;
  email: string;
  role?: UserRole;
  points?: number;
}

export class UserPayloadDto {
  name: string;
  email: string;
  role: UserRole = UserRole.USER;
  points: number = 0;
  private _errors: Array<string> = [];

  constructor(props: UserPayloadProps) {
    this.name = props.name;
    this.email = props.email;
    this.role = props.role ?? UserRole.USER;
    if (props.points) this.points = Number(props.points); // Verificar se a pessoa não mandou string
    this.validate();
  }

  validate() {
    const errors: Array<string> = [];

    if (!this.name || this.name.trim() === "") {
      errors.push("Name is required");
    }

    if (!this.email || this.email.trim() === "") {
      errors.push("email is required");
    }

    if (!this.email.endsWith("@gmail.com")) {
      errors.push("Email inválido, deve ser um email do gmail");
    }

    if (this.role !== UserRole.USER && this.role !== UserRole.ADMIN) {
      errors.push("Regra inválida");
    }

    if (this.points < 0) {
      errors.push("Pontos inválidos");
    }

    this._errors = errors;
  }

  get hasErrors(): boolean {
    return this._errors.length > 0;
  }

  get errors(): string {
    return this._errors.join(". ") + ".";
  }
}
