import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const getDirname = (meta: ImportMeta): string =>
    dirname(fileURLToPath(meta.url))
    