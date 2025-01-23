export const normalizeAzimuth = (degrees: number): number =>
  (degrees + 360) % 360;
