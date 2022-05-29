export const gearSlots = ['Helmet', 'Gloves', 'Body Armor', 'Boots'] as const;
export type GearSlot = typeof gearSlots[number];

export const eldritchTiers = [1, 2, 3, 4, 5, 6] as const;
export type EldritchTier = typeof eldritchTiers[number];

export enum EldritchType {
  Exarch = 'Exarch',
  Eater = 'Eater',
}