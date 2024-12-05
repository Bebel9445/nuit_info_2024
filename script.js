const ports = {
    "Strasbourg": { latitude: 48.5839, longitude: 7.7455 },
    "Saint-Pétersbourg": { latitude: 59.9311, longitude: 30.3609 },
    "New York": { latitude: 40.7128, longitude: -74.0060 },
    "Hambourg": { latitude: 53.5511, longitude: 9.9937 },
    "Shanghai": { latitude: 31.2304, longitude: 121.4737 },
    "Rotterdam": { latitude: 51.9244, longitude: 4.4777 },
    "Djibouti": { latitude: 11.5721, longitude: 43.1456 },
    "Yokohama": { latitude: 35.4437, longitude: 139.6380 }
};

const timezones = {
    "Strasbourg": 1,          // UTC +1 (heure d'Europe centrale)
    "Saint-Pétersbourg": 3,   // UTC +3 (heure de Moscou)
    "New York": -5,           // UTC -5 (heure de l'Est)
    "Hambourg": 1,            // UTC +1 (heure d'Europe centrale)
    "Shanghai": 8,            // UTC +8
    "Rotterdam": 1,           // UTC +1 (heure d'Europe centrale)
    "Djibouti": 3,            // UTC +3
    "Yokohama": 9             // UTC +9
};

let latitude = ports["Strasbourg"].latitude;
let longitude = ports["Strasbourg"].longitude;
let UTC = timezones["Strasbourg"]
let loc = "Strasbourg"

// Fonction qui récupère la ville séléctioné
function changePort(ville) {
    console.log(ville)
    latitude = ports[ville].latitude;
    longitude = ports[ville].longitude;
    UTC = timezones[ville]
    loc = ville
    fetchCurrentWeather();
}

function test() {
    console.log("test")
}

// Fonction pour récupérer et afficher la météo en direct
async function fetchCurrentWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }

    const data = await response.json();
    const currentWeather = data.current_weather;

    // Créer un objet Date avec l'heure actuelle
    const now = new Date();

    // Calculer l'heure locale en ajustant le décalage horaire
    const localTime = new Date(now.getTime() + (UTC-1) * 60 * 60 * 1000);

    // Afficher l'heure locale sous un format lisible
    const hours = localTime.getHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');
    const seconds = localTime.getSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    // Mettre à jour l'élément HTML si nécessaire
    document.getElementById('ville').innerText = `${loc}`;
    document.getElementById('temperature').innerText = `${currentWeather.temperature} °C`;
    document.getElementById('windspeed').innerText = `${currentWeather.windspeed} km/h`;
    document.getElementById('winddirection').innerText = `${currentWeather.winddirection} °`;
    document.getElementById('city-time').innerText = `${timeString}`;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Mettre à jour la météo toutes les minutes
fetchCurrentWeather();
setInterval(fetchCurrentWeather, 1000); // 60 000 ms = 1 minute
