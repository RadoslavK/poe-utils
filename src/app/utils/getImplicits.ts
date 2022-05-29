import eaterImplicits from '../../eldritchScanning/eater_implicits.json';
import exarchImplicits from '../../eldritchScanning/exarch_implicits.json';
import type { EldritchImplicit } from '../../eldritchScanning';

export const getImplicits = (): ReadonlyArray<EldritchImplicit> => [
  ...eaterImplicits as ReadonlyArray<EldritchImplicit>,
  ...exarchImplicits as ReadonlyArray<EldritchImplicit>,
];