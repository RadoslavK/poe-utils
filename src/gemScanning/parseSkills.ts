import { JSDOM } from 'jsdom';
import { getHtmlData } from './downloadFile.js';
import type { Gem } from './types.js';
import fs from 'fs';

export const parseSkills = async (active: boolean, url: string, selector: string, htmlDataPath: string, jsonDataPath: string): Promise<ReadonlyArray<Gem>> => {
  if (fs.existsSync(jsonDataPath)) {
    const data = await fs.promises.readFile(jsonDataPath, { encoding: 'utf-8' });

    return JSON.parse(data) as ReadonlyArray<Gem>;
  }

  const htmlData = await getHtmlData(url, htmlDataPath);
  const dom = new JSDOM(htmlData);

  const gemNodes = dom.window.document.querySelectorAll(selector);

  const gems = Array
    .from(gemNodes)
    .map((gemNode): Gem => {
      const classTypeMatch = /gem_(.+)/.exec(gemNode.className);
      const link = gemNode.getAttribute('href');
      const name = gemNode.textContent;

      if (!classTypeMatch || !link || !name) {
        throw new Error('Failed to parse gem.');
      }

      return {
        active,
        class: classTypeMatch[1]!,
        link,
        name,
      };
    });

  await fs.promises.writeFile(jsonDataPath, JSON.stringify(gems), { flag: 'w' });

  return gems;
};