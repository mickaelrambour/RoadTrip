export function haversine([lat1, lon1], [lat2, lon2]) {
  const toRad = d => d * Math.PI/180, R = 6371;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const weatherIcons = {
  0:  '☀️',  // ciel clair
  1:  '🌤️', // quelques nuages
  2:  '⛅',  // nuageux
  3:  '☁️',  // couvert
  45: '🌫️', // brume
  48: '🌫️', // brume givrée
  51: '🌦️', // bruine légère
  53: '🌦️', // bruine modérée
  55: '🌧️', // bruine dense
  61: '🌧️', // pluie légère
  63: '🌧️', // pluie modérée
  65: '🌧️', // pluie forte
  71: '❄️', // neige légère
  73: '❄️', // neige modérée
  75: '❄️', // neige forte
  80: '🌧️', // pluies éparses
  81: '🌧️', // pluies fréquentes
  82: '🌧️', // pluies violentes
  95: '⛈️', // orage
  96: '⛈️', // orage grêle
  99: '⛈️'  // orage grêle violent
};