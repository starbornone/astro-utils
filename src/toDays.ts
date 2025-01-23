import { JULIAN_DATE_2000 } from './constants';
import { toJulian } from './toJulian';

export const toDays = (date: Date): number => toJulian(date) - JULIAN_DATE_2000;
