import axios from 'axios';
import { FilterParams, RandomResult, Sample } from '../../types';

const SERVER_BASE_PATH = import.meta.env.VITE_SERVER_URL;

export async function getSample(sampleId: string): Promise<Sample> {
  const response = await axios.get(
    `${SERVER_BASE_PATH}api/sample?sampleId=${sampleId}`
  );
  return response.data;
}

export async function getRandomSample(
  params: FilterParams
): Promise<RandomResult> {
  const response = await axios.get(`${SERVER_BASE_PATH}api/sample/random`, {
    params: Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, v ? '1' : '0'])
    ),
  });
  return response.data;
}

export function getDataUrl(filename: string): string {
  return `${SERVER_BASE_PATH}tube-placement/train/${filename}.jpg`;
}
