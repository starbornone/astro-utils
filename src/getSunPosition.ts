import { altitude } from './altitude';
import { azimuth } from './azimuth';
import { DEGREES_TO_RADIANS } from './constants';
import { siderealTime } from './siderealTime';
import { sunCoords } from './sunCoords';
import { toDays } from './toDays';

export const getSunPosition = (date: Date, lat: number, lng: number) => {
  const lw = DEGREES_TO_RADIANS * -lng;
  const phi = DEGREES_TO_RADIANS * lat;
  const d = toDays(date);

  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
};
