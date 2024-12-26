export const azimuth = (H: number, phi: number, dec: number): number =>
  Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi),
  );
