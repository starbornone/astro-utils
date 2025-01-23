import { DEGREES_TO_RADIANS } from './constants';

export const solarMeanAnomaly = (d: number): number =>
  DEGREES_TO_RADIANS * (357.5291 + 0.98560028 * d);
