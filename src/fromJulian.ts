import { JULIAN_DATE_1970, MILLISECONDS_PER_DAY } from './constants';

export const fromJulian = (j: number): Date =>
  new Date((j + 0.5 - JULIAN_DATE_1970) * MILLISECONDS_PER_DAY);
