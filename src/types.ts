export interface Sample {
  sampleId: string;
  abnormalETT: boolean;
  borderlineETT: boolean;
  normalETT: boolean;
  abnormalNGT: boolean;
  borderlineNGT: boolean;
  incompletelyImagedNGT: boolean;
  normalNGT: boolean;
  abnormalCVC: boolean;
  borderlineCVC: boolean;
  normalCVC: boolean;
  swanGanzCatheterPresent: boolean;
}

export interface RandomResult {
  sample: Sample;
  count: number;
}

export interface FilterParams {
  abnormalETT?: boolean;
  borderlineETT?: boolean;
  normalETT?: boolean;
  abnormalNGT?: boolean;
  borderlineNGT?: boolean;
  incompletelyImagedNGT?: boolean;
  normalNGT?: boolean;
  abnormalCVC?: boolean;
  borderlineCVC?: boolean;
  normalCVC?: boolean;
  swanGanzCatheterPresent?: boolean;
}
