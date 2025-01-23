import { DEGREES_TO_RADIANS } from './constants';
import { getCompassAzimuth } from './getCompassAzimuth';
import { getMoonPosition } from './getMoonPosition';
import { hoursLater } from './hoursLater';

type TimeData = {
  time: Date | undefined;
  azimuth: string | undefined;
  direction: string | undefined;
};

export interface MoonData {
  moonrise?: TimeData;
  moonset?: TimeData;
}

export const getMoonTimes = (
  date: Date,
  latitude: number,
  longitude: number,
  inUTC = false,
) => {
  const hc = 0.133 * DEGREES_TO_RADIANS;
  const t = new Date(date);

  if (inUTC) {
    t.setUTCHours(0, 0, 0, 0);
  } else {
    t.setHours(0, 0, 0, 0);
  }

  let h0 = getMoonPosition(t, latitude, longitude).altitude - hc;
  let moonrise: number | undefined;
  let moonset: number | undefined;

  let altAtExtremum = 0;

  for (let i = 1; i <= 24; i += 2) {
    const h1 =
      getMoonPosition(hoursLater(t, i), latitude, longitude).altitude - hc;
    const h2 =
      getMoonPosition(hoursLater(t, i + 1), latitude, longitude).altitude - hc;

    const a = (h0 + h2) / 2 - h1;
    const b = (h2 - h0) / 2;
    const xe = -b / (2 * a);
    altAtExtremum = (a * xe + b) * xe + h1;

    const d = b * b - 4 * a * h1;
    let roots = 0;
    let x1 = 0;
    let x2 = 0;

    if (d >= 0) {
      const dx = Math.sqrt(d) / (Math.abs(a) * 2);
      x1 = xe - dx;
      x2 = xe + dx;

      if (Math.abs(x1) <= 1) roots++;
      if (Math.abs(x2) <= 1) roots++;
      if (x1 < -1) x1 = x2;
    }

    if (roots === 1) {
      if (h0 < 0) moonrise = i + x1;
      else moonset = i + x1;
    } else if (roots === 2) {
      moonrise = i + (altAtExtremum < 0 ? x2 : x1);
      moonset = i + (altAtExtremum < 0 ? x1 : x2);
    }

    if (moonrise && moonset) break;
    h0 = h2;
  }

  const moonriseTime = moonrise ? hoursLater(t, moonrise) : undefined;
  const moonsetTime = moonset ? hoursLater(t, moonset) : undefined;

  const moonriseAzimuthInfo = getCompassAzimuth(
    moonriseTime ?? null,
    latitude,
    longitude,
    false,
  );

  const moonsetAzimuthInfo = getCompassAzimuth(
    moonsetTime ?? null,
    latitude,
    longitude,
    false,
  );

  const result: MoonData = {
    moonrise: {
      time: moonriseTime,
      azimuth: moonriseAzimuthInfo?.azimuth.toFixed(1),
      direction: moonriseAzimuthInfo?.direction,
    },
    moonset: {
      time: moonsetTime,
      azimuth: moonsetAzimuthInfo?.azimuth.toFixed(1),
      direction: moonsetAzimuthInfo?.direction,
    },
  };

  return result;
};
