import type { EldritchImplicit } from '../../eldritchScanning';

export const calculateImplicitWeight = (
  availableImplicits: ReadonlyArray<EldritchImplicit>,
  implicit: EldritchImplicit,
): number => {
  const totalWeight = availableImplicits.reduce(
    (weight, implicit) => weight + implicit.weight,
    0,
  )

  const implicitWeight = availableImplicits.find(availableImplicit => availableImplicit === implicit)!.weight;

  return implicitWeight / totalWeight * 100;
}