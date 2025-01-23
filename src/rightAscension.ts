import { earthObliquity } from './earthObliquity';

export const rightAscension = (l: number, b: number): number =>
  Math.atan2(
    Math.sin(l) * Math.cos(earthObliquity) -
      Math.tan(b) * Math.sin(earthObliquity),
    Math.cos(l),
  );
