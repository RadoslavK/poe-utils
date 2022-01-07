import { PoeClass } from '../../gemScanning/types.js';
import type {
  GemWithData,
  QuestInfo,
} from '../../gemScanning/types.js';
import { getGems } from './getGems.js';

const allGems = getGems();

type GemResult = Pick<GemWithData, 'name' | 'class'> & {
  readonly level: number;
  readonly cost: GemCost;
};

type QuestResult = {
  readonly name: string;
  readonly npc: string;
  readonly rewardGem: GemResult | null;
  readonly buyGems: ReadonlyArray<GemResult>;
};

type ActResult = {
  readonly act: number;
  readonly quests: ReadonlyArray<QuestResult>;
};

const allClasses = Object.values(PoeClass);

const siosaQuestInfo: QuestInfo = {
  act: 3,
  name: 'A Fixture of Fate',
  classes: allClasses,
  npc: 'Siosa',
};

const lillyQuestInfo: QuestInfo = {
  act: 6,
  name: 'Fallen from Grade',
  classes: allClasses,
  npc: 'Lilly Roth',
};

type Writable<T> = { -readonly [P in keyof T]: Writable<T[P]> };

export const calculateActResults = (selectedGems: ReadonlyArray<string>, selectedClass: PoeClass): ReadonlyArray<ActResult> => {
  const results: Writable<ActResult>[] = [];
  const usedRewardQuests = new Set<string>();

  allGems
    .filter(g => selectedGems.includes(g.name))
    .sort((g1, g2) => g1.data.level - g2.data.level)
    .forEach((g) => {
      let questInfo: QuestInfo;
      let isReward: boolean = false;

      if ((g.data.rewardInfo && (!g.data.rewardInfo.classes.length || g.data.rewardInfo.classes.includes(selectedClass))) && !usedRewardQuests.has(g.data.rewardInfo.name)) {
        questInfo = g.data.rewardInfo;
        isReward = true;

        usedRewardQuests.add(questInfo.name);
      }
      else if (g.data.buyInfo && (!g.data.buyInfo.classes.length || g.data.buyInfo.classes.includes(selectedClass))) {
        questInfo = g.data.buyInfo;
      }
      else if (g.data.level <= 31) {
        questInfo = siosaQuestInfo;
      }
      else {
        questInfo = lillyQuestInfo;
      }

      let actResult = results.find(r => r.act === questInfo.act);

      if (!actResult) {
        actResult = {
          act: questInfo.act,
          quests: [],
        };

        results.push(actResult);
      }

      let quest = actResult.quests.find(q => q.name === questInfo.name);

      if (!quest) {
        quest = {
          name: questInfo.name,
          npc: questInfo.npc,
          buyGems: [],
          rewardGem: null,
        };

        actResult.quests.push(quest);
      }

      const gemResult: GemResult = {
        name: g.name,
        class: g.class,
        level: g.data.level,
        cost: isReward ? GemCost.Reward : getGemCost(g.data.level),
      };

      if (isReward) {
        quest.rewardGem = gemResult;
      }
      else {
        quest.buyGems.push(gemResult);
      }
    });

  return results.sort((a1, a2) => a1.act - a2.act);
};

const getGemCost = (level: number): GemCost => {
  switch (level) {
    case 1:
    case 4:
      return GemCost.Wisdom;
    case 8:
    case 10:
    case 12:
      return GemCost.Transmutation;
    case 16:
    case 18:
    case 24:
      return GemCost.Alteration;
    case 28:
    case 31:
    case 34:
      return GemCost.Chance;
    case 38:
      return GemCost.Alchemy;
    default:
      throw new Error(`Unknown gem level to determine the cost: ${level}.`);
  }
};

enum GemCost {
  None = 'None',
  Reward = 'Reward',
  Wisdom = 'Wisdom',
  Transmutation = 'Transmutation',
  Alteration = 'Alteration',
  Chance = 'Chance',
  Alchemy = 'Alchemy',
}