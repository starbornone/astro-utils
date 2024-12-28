import { azimuthToDirection } from './azimuthToDirection';
import { getMoonPosition } from './getMoonPosition';
import { getSunPosition } from './getSunPosition';
import { normalizeAzimuth } from './normalizeAzimuth';
import { radToDeg } from './radToDeg';

export const getCompassAzimuth = (
  time: Date | null,
  lat: number,
  lng: number,
  isSun: boolean,
): { azimuth: number; direction: string } => {
  if (time instanceof Date) {
    const position = isSun
      ? getSunPosition(time, lat, lng)
      : getMoonPosition(time, lat, lng);
    const rawAzimuth = radToDeg(position.azimuth);
    const adjustedAzimuth = normalizeAzimuth(rawAzimuth + 180);
    const direction = azimuthToDirection(adjustedAzimuth);

    return { azimuth: adjustedAzimuth, direction };
  }

  return { azimuth: 0, direction: '' };
};
