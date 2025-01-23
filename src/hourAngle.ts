export const hourAngle = (h: number, phi: number, d: number): number =>
  Math.acos(
    (Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)),
  );
