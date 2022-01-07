import axios from 'axios';
import fs from 'fs';

export const getHtmlData = async (url: string, dataPath: string): Promise<any> => {
  let htmlData: any;

  if (fs.existsSync(dataPath)) {
    htmlData = await fs.promises.readFile(dataPath, { encoding: 'utf-8' });
  }
  else {
    const html = await axios.get(url);
    htmlData = html.data;

    await fs.promises.writeFile(dataPath, htmlData, { flag: 'w' });
  }

  return htmlData;
};