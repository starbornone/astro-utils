import { DEGREES_TO_RADIANS, PI } from './constants';

export const eclipticLongitude = (M: number): number => {
  const C =
    DEGREES_TO_RADIANS *
    (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)); // Equation of centre
  const P = DEGREES_TO_RADIANS * 102.9372; // Perihelion of Earth
  return M + C + P + PI;
};
