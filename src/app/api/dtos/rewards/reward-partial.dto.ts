interface RewardPartialProps {
  name?: string;
  description?: string;
  points?: number;
  isEnable?: boolean | string;
  isUniqueReedem: boolean | string;

  // TODO - data de inicio e fim
}

export class RewardPartialDto {
  name?: string;
  description?: string;
  points?: number;
  private _isEnable?: string;
  private _isUniqueReedem?: string;

  get isEnable(): boolean {
    return this._isEnable === "true";
  }

  get isUniqueReedem(): boolean {
    return this._isUniqueReedem === "true";
  }

  private _errors: Array<string> = [];

  constructor(props: RewardPartialProps) {
    this.name = props.name?.trim();
    this.description = props.description?.trim();
    if (props.points) {
      this.points = Number(Number(props.points?.toString()).toFixed(0));
    }

    if (props.isEnable) {
      this._isEnable = props.isEnable?.toString().trim().toLowerCase();
    }

    if (props.isUniqueReedem) {
      this._isUniqueReedem = props.isUniqueReedem
        ?.toString()
        .trim()
        .toLowerCase();
    }

    this.validate();
  }

  validate() {
    const errors: Array<string> = [];

    if (
      !this.name &&
      !this.description &&
      !this.points &&
      !this._isEnable &&
      !this._isUniqueReedem
    ) {
      errors.push("At least one field is required");
    }

    if (this.name && this.name === "") {
      errors.push("Name is required");
    }

    if (this.description && this.description === "") {
      errors.push("Description is required");
    }

    if (this.points && this.points < 0) {
      errors.push("Points is required and must be greater than 0");
    }

    if (
      this.isEnable &&
      this._isEnable !== "true" &&
      this._isEnable !== "false"
    ) {
      errors.push("IsEnable must be a boolean");
    }

    if (
      this.isUniqueReedem &&
      this._isUniqueReedem !== "true" &&
      this._isUniqueReedem !== "false"
    ) {
      errors.push("isUniqueReedem must be a boolean");
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
