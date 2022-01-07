import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import { throttle } from 'throttle-debounce';
import { allSkillsPath } from './allSkillsPath.js';
import type {
  Gem,
  GemData,
  PoeClass,
  QuestInfo,
} from './types.js';

const hasValue = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null;

export const updateSkillsInfo = async (gems: ReadonlyArray<Gem>): Promise<void> => {
  let i = 0;

  const updateProgress = (gem: Gem) => {
    i++;

    console.log(`${i}/${gems.length} ${gem.name} scanned.`);
  };

  for (const gem of gems) {
    if (gem.data) {
      updateProgress(gem);

      continue;
    }

    const html = await axios.get(`https://poedb.tw${gem.link}`);
    const dom = new JSDOM(html.data);

    const level = +(dom.window.document.querySelector('.ItemGemSeparator + .text-type0')?.textContent ?? '0');
    const tags = Array
      .from(dom.window.document.querySelectorAll('.Stats [href*="us/"]'))
      .map(n => n.textContent)
      .filter(hasValue);

    let buyInfo: QuestInfo | null = null;
    let rewardInfo: QuestInfo | null = null;

    const questInfoNode = dom.window.document.querySelector('[id^="GemQuestgem_quest"]');

    if (questInfoNode) {
      const questRows = Array.from(questInfoNode.querySelectorAll('[id^="GemQuestgem_quest"] tr')).slice(1);

      questRows.forEach(r => {
        const act = +(r.querySelector('td:nth-child(1)')?.textContent ?? '0');
        const name = r.querySelector('td:nth-child(2)')?.textContent ?? 'Unknown Quest';
        const classes = Array
          .from(r.querySelectorAll('td:nth-child(4) a'))
          .map(c => c.textContent)
          .filter(hasValue)
          .map(c => c as PoeClass);
        const npcNode = r.querySelector('td:nth-child(3)');
        const isReward = npcNode?.textContent === 'Quest Reward';

        const questInfo: QuestInfo = {
          act,
          name,
          classes,
          npc: isReward
            ? 'Quest'
            : npcNode?.querySelector('a')?.textContent ?? 'Unknown NPC',
        };

        if (isReward) {
          rewardInfo = questInfo;
        }
        else {
          buyInfo = questInfo;
        }
      });
    }

    (gem.data! as GemData) = {
      buyInfo,
      level,
      rewardInfo,
      tags,
    };

    updateProgress(gem);
    saveGems(gems);
  }
};

const saveGems = throttle(10_000, async (gems: ReadonlyArray<Gem>): Promise<void> => {
  fs.promises.writeFile(allSkillsPath, JSON.stringify(gems), { flag: 'w' });
});