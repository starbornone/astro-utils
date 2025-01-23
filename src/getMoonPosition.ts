import { altitude } from './altitude';
import { azimuth } from './azimuth';
import { moonCoords } from './moonCoords';
import { astroRefraction } from './astroRefraction';
import { DEGREES_TO_RADIANS } from './constants';
import { toDays } from './toDays';
import { siderealTime } from './siderealTime';

export const getMoonPosition = (date: Date, lat: number, lng: number) => {
  const lw = DEGREES_TO_RADIANS * -lng;
  const phi = DEGREES_TO_RADIANS * lat;
  const d = toDays(date);

  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  const h = altitude(H, phi, c.dec);

  // Parallactic angle formula
  const pa = Math.atan2(
    Math.sin(H),
    Math.tan(phi) * Math.cos(c.dec) - Math.sin(c.dec) * Math.cos(H),
  );

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: h + astroRefraction(h), // Altitude correction for atmospheric refraction
    distance: c.dist,
    parallacticAngle: pa,
  };
};
