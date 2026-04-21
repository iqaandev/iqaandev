// Simplified prayer time calculation — purely client-side
// Uses standard astronomical formulas, good enough for bio link widget

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerInfo {
  name: string;
  time: string;
  isActive: boolean;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function toRadians(deg: number): number { return deg * DEG2RAD; }
function toDegrees(rad: number): number { return rad * RAD2DEG; }

function fixAngle(angle: number): number {
  angle = angle - 360 * Math.floor(angle / 360);
  return angle < 0 ? angle + 360 : angle;
}

function sunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15;
  const declination = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
  const EqT = q / 15 - fixAngle(RA + 360) / 15;
  return { declination, equationOfTime: EqT };
}

function julianDate(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate() + (date.getHours() + date.getMinutes() / 60) / 24;
  if (m <= 2) {
    return Math.floor(365.25 * (y - 1)) + Math.floor(30.6001 * (m + 12)) + d + 1720996.5;
  }
  return Math.floor(365.25 * y) + Math.floor(30.6001 * (m + 1)) + d + 1720996.5;
}

function asrFactor(factor: number, declination: number, lat: number): number {
  const angle = toDegrees(Math.atan(1 / (factor + Math.tan(toRadians(Math.abs(lat - declination))))));
  return angle;
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  method: 'mwl' | 'isna' | 'egypt' | 'makkah' = 'mwl'
): PrayerTimes {
  const jd = julianDate(date);
  const { declination, equationOfTime } = sunPosition(jd);

  // Method parameters: fajrAngle, ishaAngle, asrFactor
  const methods = {
    mwl: { fajr: 18, isha: 17, asr: 1 },
    isna: { fajr: 15, isha: 15, asr: 1 },
    egypt: { fajr: 19.5, isha: 17.5, asr: 1 },
    makkah: { fajr: 18.5, isha: 19, asr: 1 },
  };

  const params = methods[method];

  // Dhuhr time
  const dhuhr = 12 - longitude / 15 + date.getTimezoneOffset() / 60 - equationOfTime;

  // Sunrise & Sunset
  const cosH = (-Math.sin(toRadians(-0.833)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(declination))) /
    (Math.cos(toRadians(latitude)) * Math.cos(toRadians(declination)));
  const H = toDegrees(Math.acos(Math.max(-1, Math.min(1, cosH))));
  const sunrise = dhuhr - H / 15;
  const sunset = dhuhr + H / 15;

  // Fajr
  const cosFajr = (-Math.sin(toRadians(params.fajr)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(declination))) /
    (Math.cos(toRadians(latitude)) * Math.cos(toRadians(declination)));
  const fajrAngle = toDegrees(Math.acos(Math.max(-1, Math.min(1, cosFajr))));
  const fajr = dhuhr - fajrAngle / 15;

  // Asr
  const asrAngle = asrFactor(params.asr, declination, latitude);
  const cosAsr = (-Math.sin(toRadians(asrAngle)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(declination))) /
    (Math.cos(toRadians(latitude)) * Math.cos(toRadians(declination)));
  const asrH = toDegrees(Math.acos(Math.max(-1, Math.min(1, cosAsr))));
  const asr = dhuhr + asrH / 15;

  // Maghrib
  const maghrib = sunset + 0.05 / 60; // 3 min after sunset

  // Isha
  const cosIsha = (-Math.sin(toRadians(params.isha)) - Math.sin(toRadians(latitude)) * Math.sin(toRadians(declination))) /
    (Math.cos(toRadians(latitude)) * Math.cos(toRadians(declination)));
  const ishaAngle = toDegrees(Math.acos(Math.max(-1, Math.min(1, cosIsha))));
  const isha = dhuhr + ishaAngle / 15;

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha),
  };
}

function formatTime(hours: number): string {
  hours = ((hours % 24) + 24) % 24;
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getCurrentPrayer(prayerTimes: PrayerTimes): string {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  function toMinutes(timeStr: string): number {
    const match = timeStr.match(/(\d+):(\d+)\s*(ص|م)/);
    if (!match) return 0;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3];
    if (period === 'م' && h !== 12) h += 12;
    if (period === 'ص' && h === 12) h = 0;
    return h * 60 + m;
  }

  const prayers = [
    { name: 'الفجر', time: toMinutes(prayerTimes.fajr) },
    { name: 'الشروق', time: toMinutes(prayerTimes.sunrise) },
    { name: 'الظهر', time: toMinutes(prayerTimes.dhuhr) },
    { name: 'العصر', time: toMinutes(prayerTimes.asr) },
    { name: 'المغرب', time: toMinutes(prayerTimes.maghrib) },
    { name: 'العشاء', time: toMinutes(prayerTimes.isha) },
  ];

  let active = prayers[prayers.length - 1].name;
  for (const p of prayers) {
    if (currentMinutes < p.time) {
      active = p.name;
      break;
    }
  }

  return active;
}

export function getPrayerList(prayerTimes: PrayerTimes): PrayerInfo[] {
  const current = getCurrentPrayer(prayerTimes);
  const prayers = [
    { name: 'الفجر', time: prayerTimes.fajr, icon: '🌅' },
    { name: 'الشروق', time: prayerTimes.sunrise, icon: '☀️' },
    { name: 'الظهر', time: prayerTimes.dhuhr, icon: '🌤️' },
    { name: 'العصر', time: prayerTimes.asr, icon: '🌇' },
    { name: 'المغرب', time: prayerTimes.maghrib, icon: '🌆' },
    { name: 'العشاء', time: prayerTimes.isha, icon: '🌙' },
  ];

  return prayers.map(p => ({
    name: p.name,
    time: p.time,
    isActive: p.name === current,
  }));
}
