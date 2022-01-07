import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PoeClass } from '../gemScanning/types';
import type { FC } from './types';
import { calculateActResults } from './utils/calculateActResults.js';
import { getGems } from './utils/getGems.js';

const gemNames = getGems().map(g => g.name);

const notNull = <T extends unknown>(obj: T | null): obj is T => obj !== null;

export const App: FC = () => {
  const [poeClass, setPoeClass] = useState(() => loadSelectedClass() || PoeClass.Duelist);
  const [selectedGemValues, setSelectedGemValues] = useState<ReadonlyArray<string | null>>(() => loadSelectedGems() || [null]);
  const selectedGems = useMemo(() => selectedGemValues.filter(notNull), [selectedGemValues]);
  const results = useMemo(() => calculateActResults(selectedGems, poeClass), [selectedGems, poeClass]);

  useEffect(() => {
    saveSelectedClass(poeClass);
  }, [poeClass]);

  useEffect(() => {
    saveSelectedGems(selectedGemValues);
  }, [selectedGemValues]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '96px' }}>
        <FormControl>
          <InputLabel id="poe-class">
            Class
          </InputLabel>
          <Select
            labelId="poe-class"
            value={poeClass}
            label="class"
            onChange={e => setPoeClass(e.target.value as PoeClass)}
          >
            {Object
              .values(PoeClass)
              .map(poeClass => (
                <MenuItem
                  key={poeClass}
                  value={poeClass}
                >
                  {poeClass}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button
          sx={{ display: 'inline-block', margin: '0 8px' }}
          variant="contained"
          onClick={() => setSelectedGemValues(prevGems => prevGems.concat(null))}
        >
          Add gem
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setSelectedGemValues([null])}
        >
          Reset gems
        </Button>
        <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          {selectedGemValues.map((g, index, self) => (
            <Autocomplete
              key={index}
              disablePortal
              options={gemNames.filter(x => x === g || !selectedGems.includes(x))}
              sx={{ width: 300, marginTop: 2, marginBottom: 2 }}
              value={g}
              onChange={(e, newValue) => {
                const newGem = newValue as string | null;

                setSelectedGemValues(prevGems => prevGems.map((x, index2) => index === index2 ? newGem : x));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus={index === self.length - 1}
                  label="Gem"
                />
              )}
            />
          ))}
        </div>
      </div>
      <div style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
        {results.map((result) => (
          <div key={result.act} style={{ margin: '24px 0', marginRight: '72px' }}>
            <h2>Act {result.act}</h2>
            <div>
              {result.quests.map(quest => (
                <div key={quest.name} style={{ margin: '16px 0' }}>
                  <h4>{quest.name}</h4>
                  {quest.rewardGem && (
                    <div>Reward: <span style={{ color: quest.rewardGem.class }}>{quest.rewardGem.name} ({quest.rewardGem.level})</span></div>
                  )}
                  {!!quest.buyGems.length && quest.buyGems.map(gem => (
                    <div key={gem.name}>Buy: <span style={{ color: gem.class }}>{gem.name} ({gem.level})</span> for {gem.cost}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

App.displayName = 'App';

const selectedClassKey = 'selected-class';

const loadSelectedClass = (): PoeClass | null => {
  const poeClass = localStorage.getItem(selectedClassKey);

  return poeClass ? poeClass as PoeClass : null;
};

const saveSelectedClass = (poeClass: PoeClass): void => {
  localStorage.setItem(selectedClassKey, poeClass);
}

const selectedGemsKey = 'selected-gems'

const loadSelectedGems = (): ReadonlyArray<string> | null => {
  const gems = localStorage.getItem(selectedGemsKey);

  return gems ? JSON.parse(gems) as ReadonlyArray<string> : null;
}

const saveSelectedGems = (gems: ReadonlyArray<string | null>): void => {
  localStorage.setItem(selectedGemsKey, JSON.stringify(gems));
};