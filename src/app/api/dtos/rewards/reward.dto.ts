export interface RewardDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly points: number;
  readonly isEnable: boolean;
  readonly isUniqueReedem: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
