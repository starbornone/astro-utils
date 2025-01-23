import { declination } from './declination';
import { eclipticLongitude } from './eclipticLongitude';
import { rightAscension } from './rightAscension';
import { solarMeanAnomaly } from './solarMeanAnomaly';

export const sunCoords = (d: number) => {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0),
  };
};
