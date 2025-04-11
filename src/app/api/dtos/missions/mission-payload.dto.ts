interface MissionPayloadProps {
  name: string;
  description: string;
  points: number;
  isEnable: boolean | string;

  // TODO - data de inicio e fim
}

export class MissionPayloadDto {
  name: string;
  description: string;
  points: number;

  private _isEnable?: boolean;
  private _errors: Array<string> = [];

  get isEnable(): boolean {
    return this._isEnable === true;
  }

  constructor(props: MissionPayloadProps) {
    this.name = props.name?.trim();
    this.description = props.description?.trim();
    this.points = Number(Number(props.points?.toString()).toFixed(0));

    const isEnable = props.isEnable?.toString().toLowerCase();

    this._isEnable =
      isEnable == "true" ? true : isEnable == "false" ? false : undefined;
    this.validate();
  }

  validate() {
    const errors: Array<string> = [];

    if (!this.name || this.name === "") {
      errors.push("Name is required");
    }

    if (!this.description || this.description === "") {
      errors.push("Description is required");
    }

    if (!this.points || this.points < 0) {
      errors.push("Points is required and must be greater than 0");
    }

    if (this._isEnable === undefined) {
      errors.push("IsEnable must be a boolean");
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
