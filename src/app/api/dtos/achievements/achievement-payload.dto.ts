interface AchievementPayloadProps {
  missionId: string;
  evidence: string;
}

export class AchievementPayloadDto {
  readonly missionId: string;
  readonly evidence: string;

  private _errors: Array<string> = [];

  constructor(props: AchievementPayloadProps) {
    this.missionId = props.missionId?.trim();
    this.evidence = props.evidence?.trim();

    this.validate();
  }

  validate() {
    const errors: Array<string> = [];

    if (!this.missionId || this.missionId === "") {
      errors.push("missionId is required");
    }

    if (!this.evidence || this.evidence === "") {
      errors.push("evidence is required");
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
