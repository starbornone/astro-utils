import { JULIAN_DATE_2000 } from './constants';

export const solarTransitJ = (ds: number, M: number, L: number): number =>
  JULIAN_DATE_2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
