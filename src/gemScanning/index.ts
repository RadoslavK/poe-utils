import { getAllSkills } from './getAllSkills.js';
import { updateSkillsInfo } from './updateSkillsInfo.js';

const allSkills = await getAllSkills();

await updateSkillsInfo(allSkills);

console.log('DONE!');