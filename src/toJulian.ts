import { JULIAN_DATE_1970, MILLISECONDS_PER_DAY } from './constants';

export const toJulian = (date: Date): number =>
  date.valueOf() / MILLISECONDS_PER_DAY - 0.5 + JULIAN_DATE_1970;
