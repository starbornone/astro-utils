export const astroRefraction = (h: number): number => {
  if (h < 0) h = 0; // Formula only works for positive altitudes
  return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
};
