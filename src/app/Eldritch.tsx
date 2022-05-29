import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from '@mui/material';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { EldritchImplicit } from '../eldritchScanning';
import {
  EldritchTier,
  eldritchTiers,
  EldritchType,
  GearSlot,
  gearSlots,
} from '../eldritchScanning/types.js';
import type { FC } from './_shared/types.js';
import { calculateImplicitWeight } from './utils/calculateImplicitWeight';
import { getAvailableImplicits } from './utils/getAvailableImplicits';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  width: 200px;
`

export const Eldritch: FC = () => {
  const [poeGear, setPoeGear] = useState<GearSlot>(gearSlots[0]);
  const [eldritchType, setEldritchType] = useState<EldritchType>(EldritchType.Eater);
  const [tier, setTier] = useState<EldritchTier>(6);

  const availableImplicits = useMemo(
    () => getAvailableImplicits(poeGear, eldritchType, tier),
    [poeGear, eldritchType, tier],
  );

  const [implicit, setImplicit] = useState<EldritchImplicit | null>(null);
  const implicitWeight = useMemo(() => implicit && calculateImplicitWeight(availableImplicits, implicit), [availableImplicits, implicit]);

  useEffect(() => {
    setImplicit(availableImplicits[0]!);
  }, [availableImplicits]);

  const resetImplicit = () => setImplicit(null);

  return (
    <Container>
      <FormControl>
        <InputLabel id="poe-gear">
          Gear
        </InputLabel>
        <Select
          labelId="poe-gear"
          value={poeGear}
          label="gear"
          onChange={e => {
            setPoeGear(e.target.value as GearSlot);
            resetImplicit();
          }}
        >
          {gearSlots.map(poeGear => (
            <MenuItem
              key={poeGear}
              value={poeGear}
            >
              {poeGear}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="eldritch-type">
          Type
        </InputLabel>
        <Select
          labelId="eldritch-type"
          value={eldritchType}
          label="eldritch type"
          onChange={e => {
            setEldritchType(e.target.value as EldritchType);
            resetImplicit();
          }}
        >
          {Object
            .values(EldritchType)
            .map(type => (
              <MenuItem
                key={type}
                value={type}
              >
                {type}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="eldritch-type">
          Tier
        </InputLabel>
        <Select
          labelId="tier"
          value={tier}
          label="tier"
          onChange={e => {
            setTier(e.target.value as EldritchTier);
            resetImplicit();
          }}
        >
          {eldritchTiers.map(tier => (
            <MenuItem
              key={tier}
              value={tier}
            >
              {tier}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        disablePortal
        options={availableImplicits.map(implicit => implicit.description)}
        sx={{ width: 500, marginTop: 2, marginBottom: 2 }}
        value={implicit?.description ?? null}
        onChange={(e, newValue) => {
          const newImplicit = newValue as string;

          setImplicit(availableImplicits.find(implicit => implicit.description === newImplicit)!);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            label="Implicit"
          />
        )}
      />
      {implicitWeight !== null && (
        <div>
          Chance: {implicitWeight.toFixed(2)} %
        </div>
      )}
    </Container>
  );
};

Eldritch.displayName = 'Eldritch';