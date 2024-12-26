import { earthObliquity } from './earthObliquity';

export const declination = (l: number, b: number): number =>
  Math.asin(
    Math.sin(b) * Math.cos(earthObliquity) +
      Math.cos(b) * Math.sin(earthObliquity) * Math.sin(l),
  );
