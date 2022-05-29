import type { EldritchImplicit } from '../../eldritchScanning';
import type {
  EldritchTier,
  EldritchType,
} from '../../eldritchScanning/types';
import type { GearSlot } from '../../eldritchScanning/types';
import { getImplicits } from './getImplicits';

const allImplicits = getImplicits();

export const getAvailableImplicits = (
  gear: GearSlot,
  type: EldritchType,
  tier : EldritchTier,
): ReadonlyArray<EldritchImplicit> => allImplicits.filter(implicit =>
  implicit.gear === gear
  && implicit.type === type
  && implicit.tier === tier,
);