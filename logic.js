const REPO_CONFIG = { owner: '000jd', repo: 'wallpapers', branch: 'main' };
const SEARCH_URLS = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  bing: 'https://www.bing.com/search?q=',
  youtube: 'https://www.youtube.com/results?search_query='
};

let activeEngine = 'google';

const els = {
  time: document.getElementById('time'),
  date: document.getElementById('date'),
  period: document.getElementById('periodText'),
  greetingName: document.getElementById('greetingName'),
  wallpaper: document.getElementById('wallpaper'),
  loader: document.getElementById('loader'),
  content: document.getElementById('content'),
  temp: document.getElementById('temp'),
  condition: document.getElementById('condition'),
  weatherIcon: document.getElementById('weatherIcon')
};

// --- 1. Clock & Greeting ---
function updateClock() {
  const now = new Date();
  els.time.textContent = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  els.date.textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const hr = now.getHours();
  els.period.textContent = hr < 12 ? 'Morning' : hr < 18 ? 'Afternoon' : 'Evening';
}
setInterval(updateClock, 1000);
updateClock();

// Load saved name from localStorage
const savedName = localStorage.getItem('username');
if (savedName) {
  els.greetingName.textContent = savedName;
} else {
  // If no name is saved, display the weekday as a default
  els.greetingName.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

// Save name to localStorage on edit
els.greetingName.addEventListener('input', (e) => {
  localStorage.setItem('username', e.target.textContent);
});



async function fetchWeather() {
  let lat = 28.61, lon = 77.20; 
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
  } catch (e) {
    console.log("Location access denied or failed. Using default.");
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    const data = await res.json();
    
    const w = data.current_weather;
    els.temp.textContent = Math.round(w.temperature) + "°";
    
    const code = w.weathercode;
    let desc = "Clear";
    let icon = "ph-sun";

    if (code > 0 && code <= 3) { desc = "Cloudy"; icon = "ph-cloud"; }
    else if (code >= 45 && code <= 48) { desc = "Foggy"; icon = "ph-cloud-fog"; }
    else if (code >= 51 && code <= 67) { desc = "Rain"; icon = "ph-drop"; }
    else if (code >= 71) { desc = "Snow"; icon = "ph-snowflake"; }
    else if (code >= 95) { desc = "Storm"; icon = "ph-lightning"; }

    els.condition.textContent = desc;
    els.weatherIcon.className = `ph ${icon} weather-icon`;
  } catch (e) {
    els.condition.textContent = "Offline";
  }
}
fetchWeather();

document.querySelectorAll('.engine-dot').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.engine-dot').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeEngine = btn.dataset.engine;
    document.getElementById('searchInput').focus();
  });
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) window.location.href = SEARCH_URLS[activeEngine] + encodeURIComponent(val);
  }
});

async function loadWallpaper() {
  els.wallpaper.classList.remove('loaded');
  els.content.style.display = 'none';
  els.loader.style.display = 'block';

  try {
    const api = `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}/contents?ref=${REPO_CONFIG.branch}`;
    const res = await fetch(api);
    const files = await res.json();
    const images = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name));
    
    if (images.length === 0) throw new Error("No images");
    
    const randomImg = images[Math.floor(Math.random() * images.length)];
    const imgUrl = randomImg.download_url;

    const img = new Image();
    img.onload = () => {
      els.wallpaper.style.backgroundImage = `url('${imgUrl}')`;
      els.wallpaper.classList.add('loaded');
      els.loader.style.display = 'none';
      els.content.style.display = 'grid';
    };
    img.src = imgUrl;

  } catch (e) {
    console.error(e);
    els.wallpaper.style.background = '#111';
    els.loader.style.display = 'none';
    els.content.style.display = 'grid';
  }
}

document.getElementById('refreshBtn').addEventListener('click', loadWallpaper);
loadWallpaper();

document.getElementById('app-chatgpt').addEventListener('click', () => window.location.href='https://chatgpt.com');
document.getElementById('app-perplexity').addEventListener('click', () => window.location.href='https://www.perplexity.ai');
document.getElementById('app-gmail').addEventListener('click', () => window.location.href='https://mail.google.com');
document.getElementById('app-github').addEventListener('click', () => window.location.href='https://github.com');