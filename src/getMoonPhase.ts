export type MoonPhase =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export interface MoonPhaseData {
  phase: MoonPhase;
  percentage: number;
  age: number;
  nextNewMoon: Date;
  nextFullMoon: Date;
}

function calculateIlluminationPercent(age: number): number {
  const lunarCycle = 29.53059;
  const phaseAngle = (age / lunarCycle) * 360;
  const illumination = ((1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2) * 100;
  return parseFloat(illumination.toFixed(1));
}

export function getMoonPhase(date: Date): MoonPhaseData {
  // Adjust for UTC+11
  const utcOffset = 11;
  const localDate = new Date(date.getTime() + utcOffset * 60 * 60 * 1000);

  // Epoch is 2024-01-11 11:57:00 UTC - New Moon
  const epoch = new Date(2024, 0, 11, 11, 57, 0).getTime();
  const synMonth = 29.53058867; // Synodic month (new Moon to new Moon)

  const diff = localDate.getTime() - epoch;
  const days = diff / (1000 * 60 * 60 * 24);
  const age = days % synMonth;

  // Calculate time to next new moon (December 31, 2024)
  const newMoonDate = new Date(2024, 11, 31, 9, 26, 0);
  const nextNewMoon = new Date(
    newMoonDate.getTime() + utcOffset * 60 * 60 * 1000,
  );

  // Calculate time to next full moon (January 14, 2025)
  const fullMoonDate = new Date(2025, 0, 14, 9, 26, 0);
  const nextFullMoon = new Date(
    fullMoonDate.getTime() + utcOffset * 60 * 60 * 1000,
  );

  // Calculate illumination percentage
  const percentage = calculateIlluminationPercent(age);

  // Determine moon phase based on age in days
  const phase: MoonPhase = (() => {
    if (age < 1.84566) return 'New Moon';
    if (age < 7.38264) return 'Waxing Crescent';
    if (age < 9.2283) return 'First Quarter';
    if (age < 14.76528) return 'Waxing Gibbous';
    if (age < 16.61094) return 'Full Moon';
    if (age < 22.14792) return 'Waning Gibbous';
    if (age < 23.99358) return 'Last Quarter';
    if (age < 29.53059) return 'Waning Crescent';
    return 'New Moon';
  })();

  return { phase, percentage, age, nextNewMoon, nextFullMoon };
}
