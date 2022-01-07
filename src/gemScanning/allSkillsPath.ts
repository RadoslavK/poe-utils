import { join } from 'path';
import {getDirname} from "../utils/getDirname.js";

const __dirname = getDirname(import.meta);

export const allSkillsPath = join(__dirname, 'all_skills.json');