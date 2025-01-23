import { approxTransit } from './approxTransit';
import { DEGREES_TO_RADIANS } from './constants';
import { declination } from './declination';
import { eclipticLongitude } from './eclipticLongitude';
import { fromJulian } from './fromJulian';
import { hourAngle } from './hourAngle';
import { julianCycle } from './julianCycle';
import { solarMeanAnomaly } from './solarMeanAnomaly';
import { solarTransitJ } from './solarTransitJ';
import { toDays } from './toDays';

export interface SunData {
  solarNoon: Date;
  nadir: Date;
  sunrise: Date;
  sunset: Date;
  sunriseEnd: Date;
  sunsetStart: Date;
  dawn: Date;
  dusk: Date;
  nauticalDawn: Date;
  nauticalDusk: Date;
  nightEnd: Date;
  night: Date;
  goldenHourEnd: Date;
  goldenHour: Date;
  daylightHours: string;
  [key: string]: Date | string;
}

/**
 * Calculates Julian date for sunrise/sunset.
 * Based on the equations from "Astronomical Algorithms" by Jean Meeus.
 * @see {@link https://en.wikipedia.org/wiki/Sunrise_equation}
 *
 * @param h - Height of the sun in radians (h₀)
 * @param lw - Observer's geographical longitude (λ) in radians (negative west)
 * @param phi - Observer's geographical latitude (φ) in radians
 * @param dec - Sun's declination (δ) in radians
 * @param n - Julian cycle (number of days since J2000.0)
 * @param meanAnomaly - Sun's mean anomaly
 * @param meanLongitude - Sun's mean longitude
 * @returns Julian date for the sun passing specified height
 */
export const getSetJ = (
  h: number,
  lw: number,
  phi: number,
  dec: number,
  n: number,
  meanAnomaly: number,
  meanLongitude: number,
): number => {
  const w = hourAngle(h, phi, dec);
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, meanAnomaly, meanLongitude);
};

export const getSunTimes = (
  date: Date,
  lat: number,
  lng: number,
  height = 0,
) => {
  const lw = DEGREES_TO_RADIANS * -lng;
  const phi = DEGREES_TO_RADIANS * lat;

  const dh = (-2.076 * Math.sqrt(height)) / 60; // Observer height correction
  const days = toDays(date);
  const n = julianCycle(days, lw);
  const ds = approxTransit(0, lw, n);

  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);

  const Jnoon = solarTransitJ(ds, M, L);

  /**
   * Solar position calculation based on:
   * @see https://en.wikipedia.org/wiki/Position_of_the_Sun
   * @see https://en.wikipedia.org/wiki/Sunrise_equation
   *
   * Key angles (in degrees):
   * -0.833: Official sunrise/sunset (atmospheric refraction + sun's diameter)
   * -6: Civil twilight
   * -12: Nautical twilight
   * -18: Astronomical twilight
   * 6: Golden hour (soft lighting conditions)
   */
  const times = [
    [-0.833, 'sunrise', 'sunset'],
    [-0.3, 'sunriseEnd', 'sunsetStart'],
    [-6, 'dawn', 'dusk'],
    [-12, 'nauticalDawn', 'nauticalDusk'],
    [-18, 'nightEnd', 'night'],
    [6, 'goldenHourEnd', 'goldenHour'],
  ];

  const result: SunData = {
    dawn: date,
    daylightHours: '0 hours, 0 minutes',
    dusk: date,
    goldenHour: date,
    goldenHourEnd: date,
    nadir: fromJulian(Jnoon - 0.5),
    nauticalDawn: date,
    nauticalDusk: date,
    night: date,
    nightEnd: date,
    solarNoon: fromJulian(Jnoon),
    sunrise: date,
    sunriseEnd: date,
    sunset: date,
    sunsetStart: date,
  };

  /**
   * Calculates rise/set times for different solar angles.
   * Uses Julian date for internal calculations.
   * h0: altitude of sun for given phenomenon
   * Jnoon: Julian date for solar noon
   * phi: observer's latitude
   * dec: sun's declination
   * @see https://en.wikipedia.org/wiki/Julian_day
   */
  for (const [angle, riseName, setName] of times) {
    const h0 = ((angle as number) + dh) * DEGREES_TO_RADIANS;
    const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
    const Jrise = Jnoon - (Jset - Jnoon);

    result[riseName as keyof SunData] = fromJulian(Jrise);
    result[setName as keyof SunData] = fromJulian(Jset);

    /**
     * Special case for official sunrise/sunset (-0.833°)
     * Calculates total daylight hours including fractional minutes
     */
    if (angle === -0.833) {
      const daylightHours = (Jset - Jrise) * 24;
      const hours = Math.floor(daylightHours);
      const minutes = Math.round((daylightHours - hours) * 60);
      result.daylightHours = `${hours} hours, ${minutes} minutes`;
    }
  }

  return result;
};
