import { DEGREES_TO_RADIANS } from './constants';
import { declination } from './declination';
import { rightAscension } from './rightAscension';

export const moonCoords = (d: number) => {
  const L = DEGREES_TO_RADIANS * (218.316 + 13.176396 * d); // Moon's mean longitude
  const M = DEGREES_TO_RADIANS * (134.963 + 13.064993 * d); // Moon's mean anomaly
  const F = DEGREES_TO_RADIANS * (93.272 + 13.22935 * d); // Moon's mean distance from ascending node

  const l = L + DEGREES_TO_RADIANS * 6.289 * Math.sin(M); // Geocentric ecliptic longitude
  const b = DEGREES_TO_RADIANS * 5.128 * Math.sin(F); // Geocentric ecliptic latitude
  const dt = 385001 - 20905 * Math.cos(M); // Distance to the moon in km

  return {
    ra: rightAscension(l, b),
    dec: declination(l, b),
    dist: dt,
  };
};
