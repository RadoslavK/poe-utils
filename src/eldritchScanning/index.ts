import fs from 'fs';
import { JSDOM } from 'jsdom';
import { join } from 'path';
import { getHtmlData } from '../gemScanning/downloadFile.js';
import {
  EldritchType,
  type EldritchTier,
  type GearSlot,
} from './types.js';

export type EldritchImplicit = {
  readonly description: string;
  readonly gear: GearSlot;
  readonly tier: EldritchTier;
  readonly type: EldritchType;
  readonly weight: number;
};

const parseEldritchImplicits = async (url: string, id: string, type: EldritchType, htmlDataPath: string, jsonDataPath: string): Promise<void> => {
  if (fs.existsSync(jsonDataPath)) {
    return;
  }

  const htmlData = await getHtmlData(url, htmlDataPath);
  const dom = new JSDOM(htmlData);


  const implicitRows = dom.window.document.querySelectorAll(`#${id} table tbody tr`);

  const implicits = Array
    .from(implicitRows)
    .map((implicitRow): EldritchImplicit | null => {
      const description = implicitRow.querySelector('td:nth-child(2) .implicitMod')?.textContent;

      if (!description) {
        throw new Error('Did not find description');
      }

      const implicitText = implicitRow.querySelector('td:nth-child(3)')?.textContent;

      if (!implicitText) {
        throw new Error('Did not find implicit text');
      }

      const implicitMatch = /(\d+)_eldritch_implicit \d(.*?)default/.exec(implicitText);

      if (!implicitMatch) {
        throw new Error('Failed to parse the implicit');
      }

      const tier = +implicitMatch[1]!;

      if (!isKnownTier(tier)) {
        throw new Error(`Found unknown implicit tier: ${tier}.`);
      }

      const weightText = implicitMatch[2]!;
      const weightMatch = /(.*?) (\d+)/g.exec(weightText);

      if (!weightMatch) {
        throw new Error('Failed to parse the weight of implicit.');
      }

      let gear: GearSlot;

      try {
        gear = mapGearToSlot(weightMatch[1]!);
      } catch (error) {
        console.error(error);

        return null;
      }

      const weight = +weightMatch[2]!;

      return {
        description,
        gear,
        tier,
        type,
        weight,
      };
    })
    .filter((implicit): implicit is EldritchImplicit => !!implicit);

  await fs.promises.writeFile(jsonDataPath, JSON.stringify(implicits), { flag: 'w' });
};

const isKnownTier = (tier: number): tier is EldritchTier => tier >= 1 && tier <= 6

const mapGearToSlot = (gear: string): GearSlot => {
  switch (gear) {
    case 'gloves': return 'Gloves';
    case 'helmet': return 'Helmet';
    case 'body_armour': return 'Body Armor';
    case 'boots': return 'Boots';
    default: throw new Error(`Uknown gear slot: ${gear}.`);
  }
};

await parseEldritchImplicits('https://poedb.tw/us/Eldritch_implicit#TheSearingExarchImplicit', 'Siege_of_the_AtlasEldritchRed', EldritchType.Exarch, join(__dirname, 'exarch_implicits.html'), join(__dirname, 'exarch_implicits.json'));
await parseEldritchImplicits('https://poedb.tw/us/Eldritch_implicit#TheEaterofWorldsImplicit', 'Siege_of_the_AtlasEldritchBlue', EldritchType.Eater, join(__dirname, 'eater_implicits.html'), join(__dirname, 'eater_implicits.json'));