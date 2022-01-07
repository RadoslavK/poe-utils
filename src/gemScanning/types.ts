export enum PoeClass {
  Marauder = 'Marauder',
  Witch = 'Witch',
  Scion = 'Scion',
  Ranger = 'Ranger',
  Duelist = 'Duelist',
  Shadow = 'Shadow',
  Templar = 'Templar',
}

export type QuestInfo = {
  readonly act: number;
  readonly classes: ReadonlyArray<PoeClass>;
  readonly name: string;
  readonly npc: string;
};

export type GemData = {
  readonly level: number;
  readonly tags: ReadonlyArray<string>;
  readonly buyInfo: QuestInfo | null;
  readonly rewardInfo: QuestInfo | null;
};

export type Gem = {
  readonly name: string;
  readonly class: string;
  readonly link: string;
  readonly active: boolean;
  readonly data?: GemData;
};

export type GemWithData = Omit<Gem, 'data'> & {
  readonly data: GemData;
};