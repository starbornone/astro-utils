export const azimuthToDirection = (azimuth: number): string => {
  const directions = [
    'North',
    'Northeast',
    'East',
    'Southeast',
    'South',
    'Southwest',
    'West',
    'Northwest',
  ];
  const index = Math.round(azimuth / 45) % 8;
  return directions[index];
};
