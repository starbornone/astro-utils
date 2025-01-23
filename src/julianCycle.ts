import { JULIAN_DATE_0, PI } from './constants';

export const julianCycle = (d: number, lw: number): number =>
  Math.round(d - JULIAN_DATE_0 - lw / (2 * PI));
