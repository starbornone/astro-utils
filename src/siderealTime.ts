import { DEGREES_TO_RADIANS } from './constants';

export const siderealTime = (d: number, lw: number): number =>
  DEGREES_TO_RADIANS * (280.16 + 360.9856235 * d) - lw;
