export interface UserPartialProps {
  name?: string;
  points?: number;
}

export class UserPartialDto {
  name?: string;
  points?: number;
  private _errors: Array<string> = [];

  constructor(props: UserPartialProps) {
    this.name = props?.name;

    if (props?.points) this.points = Number(props?.points);

    this.validate();
  }

  validate() {
    const errors: Array<string> = [];
    const nameTrim = this.name?.trim();

    if (!nameTrim && !this.points) {
      errors.push("Informe ao menos um valor para ser atualizado.");
    }

    if (this.points && this.points < 0) {
      errors.push("Não é possivel atualizar pontos para um valor negativo.");
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
