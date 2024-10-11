import { parse } from '@vanillaes/csv';
import fs from 'fs/promises';
import { Sample } from '../types';
import { log } from './helper';

const DATA_DIR = 'dist/app/tube-placement/';

export let samples: Sample[] = [];

export async function readSamples(): Promise<void> {
  log('Reading sample index');
  const data = await fs.readFile(DATA_DIR + 'train.csv', {
    encoding: 'utf8',
  });

  const parsed = parse(data);
  parsed.shift(); // Remove the header row

  samples = parsed.map(row => ({
    sampleId: row[0],
    abnormalETT: row[1] === '1',
    borderlineETT: row[2] === '1',
    normalETT: row[3] === '1',
    abnormalNGT: row[4] === '1',
    borderlineNGT: row[5] === '1',
    incompletelyImagedNGT: row[6] === '1',
    normalNGT: row[7] === '1',
    abnormalCVC: row[8] === '1',
    borderlineCVC: row[9] === '1',
    normalCVC: row[10] === '1',
    swanGanzCatheterPresent: row[11] === '1',
  }));
}
