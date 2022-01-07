import { join } from 'path';
import fs from 'fs';
import { allSkillsPath } from './allSkillsPath.js';
import { parseSkills } from './parseSkills.js';
import type { Gem } from './types.js';
import { getDirname } from "../utils/getDirname.js";

const __dirname = getDirname(import.meta);

export const getAllSkills = async (): Promise<ReadonlyArray<Gem>> => {
  if (fs.existsSync(allSkillsPath)) {
    const allSkillsData = await fs.promises.readFile(allSkillsPath, { encoding: 'utf-8' });

    return JSON.parse(allSkillsData) as ReadonlyArray<Gem>;
  }

  const activeSkills = await parseSkills(true, 'https://poedb.tw/us/Active_Skill_Gems', '#ActiveSkillGemsGem a[class^="gem_"]', join(__dirname, 'active_skills.html'), join(__dirname, 'active_skills.json'));
  const supportSkills = await parseSkills(false, 'https://poedb.tw/us/Support_Skill_Gems', '#SupportSkillGemsGem a[class^="gem_"]', join(__dirname, 'support_skills.html'), join(__dirname, 'support_skills.json'));
  const allSkills = activeSkills
      .concat(supportSkills)
      //  Filter out duplicates
      .filter((value, index, self) => index === self.findIndex(t => t.name === value.name));

  await fs.promises.writeFile(allSkillsPath, JSON.stringify(allSkills), { flag: 'w' });

  return allSkills;
};