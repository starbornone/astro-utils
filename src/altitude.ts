export const altitude = (H: number, phi: number, dec: number): number =>
  Math.asin(
    Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H),
  );
