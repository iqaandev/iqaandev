// Qibla direction calculation — purely client-side
// Uses browser Geolocation API + spherical trigonometry

export interface QiblaResult {
  degrees: number;
  direction: string;
}

const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function calculateQibla(latitude: number, longitude: number): QiblaResult {
  const latRad = toRadians(latitude);
  const lngRad = toRadians(longitude);
  const meccaLatRad = toRadians(MECCA_LAT);
  const meccaLngRad = toRadians(MECCA_LNG);

  const dLng = meccaLngRad - lngRad;

  const y = Math.sin(dLng);
  const x =
    Math.cos(latRad) * Math.tan(meccaLatRad) -
    Math.sin(latRad) * Math.cos(dLng);

  let qibla = toDegrees(Math.atan2(y, x));
  qibla = ((qibla % 360) + 360) % 360;

  return {
    degrees: Math.round(qibla * 10) / 10,
    direction: getDirectionLabel(qibla),
  };
}

function getDirectionLabel(degrees: number): string {
  if (degrees >= 337.5 || degrees < 22.5) return 'شمال';
  if (degrees >= 22.5 && degrees < 67.5) return 'شمال شرق';
  if (degrees >= 67.5 && degrees < 112.5) return 'شرق';
  if (degrees >= 112.5 && degrees < 157.5) return 'جنوب شرق';
  if (degrees >= 157.5 && degrees < 202.5) return 'جنوب';
  if (degrees >= 202.5 && degrees < 247.5) return 'جنوب غرب';
  if (degrees >= 247.5 && degrees < 292.5) return 'غرب';
  if (degrees >= 292.5 && degrees < 337.5) return 'شمال غرب';
  return '';
}

export function requestGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 min cache
    });
  });
}

export function getQiblaArrowStyle(degrees: number): React.CSSProperties {
  return {
    transform: `rotate(${degrees}deg)`,
    transition: 'transform 0.5s ease-out',
  };
}
