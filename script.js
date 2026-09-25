const API = "https://api.open-meteo.com/v1/forecast";

// Weather code → mood mapping (Open-Meteo ke codes)
const MOODS = {
  sunny:  { codes: [0, 1],        theme: 'sunny',  msg: '☀️ Ice cream time!' },
  cloudy: { codes: [2, 3],        theme: 'cloudy', msg: '☁️ Chai peelo' },
  rain:   { codes: [51,53,55,61,63,65,80,81,82], theme: 'rain', msg: '🌧️ Chai + pakode' },
  snow:   { codes: [71,73,75,77,85,86], theme: 'snow', msg: '❄️ Soup time' },
  storm:  { codes: [95,96,99],    theme: 'storm', msg: '⛈️ Ghar pe raho' },
  fog:    { codes: [45,48],       theme: 'fog',   msg: '🌫️ Drive safe' },
};

async function getWeather(lat, lon) {
  const res = await fetch(
    `${API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`
  );
  const data = await res.json();
  return data.current;
}

function getMood(code) {
  for (const [key, val] of Object.entries(MOODS)) {
    if (val.codes.includes(code)) return { key, ...val };
  }
  return { key: 'cloudy', theme: 'cloudy', msg: '🌤️ Normal din' };
}

// Location se
async function loadByLocation() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const w = await getWeather(pos.coords.latitude, pos.coords.longitude);
    render(w);
  });
}

function render(w) {
  const mood = getMood(w.weather_code);
  document.body.className = `theme-${mood.theme}`;
  document.getElementById('temp').textContent = `${w.temperature_2m}°C`;
  document.getElementById('msg').textContent = mood.msg;
  document.getElementById('wind').textContent = `${w.wind_speed_10m} km/h`;
}

document.getElementById('locBtn').onclick = loadByLocation;
