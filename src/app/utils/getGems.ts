import allSkills from '../../gemScanning/all_skills.json';
import type { GemWithData } from '../../gemScanning/types.js';

export const getGems = (): ReadonlyArray<GemWithData> => allSkills as ReadonlyArray<GemWithData>;