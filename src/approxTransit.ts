import { JULIAN_DATE_0, PI } from './constants';

export const approxTransit = (Ht: number, lw: number, n: number): number =>
  JULIAN_DATE_0 + (Ht + lw) / (2 * PI) + n;
