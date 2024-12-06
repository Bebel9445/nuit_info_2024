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

const logo = document.getElementById('easter-egg-logo');
const gif = document.getElementById('gif');
const audio = document.getElementById('rickroll-audio');
const images = "assets/Lyreco.png";

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
const waterImage = new Image();
const weatherImage = new Image();
const weatherWidth = 150;
const weatherHeight = 150;
let meteo_code = 0;

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
    const code = currentWeather.weathercode;

    // Créer un objet Date avec l'heure actuelle
    const now = new Date();

    // Calculer l'heure locale en ajustant le décalage horaire
    const localTime = new Date(now.getTime() + (UTC-1) * 60 * 60 * 1000);

    // Afficher l'heure locale sous un format lisible
    const hours = localTime.getHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');
    const seconds = localTime.getSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    // Charger l'image de l'eau en fonction de l'heure
    if (hours >= 10 && hours < 18) {
        waterImage.src = "assets/water_day.png";
    }
    else if (hours >= 6 && hours < 10) {
        waterImage.src = "assets/water_sunset.png";
    }
    else {
        waterImage.src = "assets/water_night.png";
    }

    // Change l'image de la météo en fonction du code
    if (code === 0) {
        weatherImage.src = "assets/soleil.png";
        meteo_code = 1;
    }
    else if (code === 1 || code === 2 || code === 3) {
        weatherImage.src = "assets/nuage.png";
        meteo_code = 2;
    }
    else if (code === 61 || code === 63 || code === 65){
        weatherImage.src = "assets/pluie.png";
        meteo_code = 3;
    }


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
setInterval(fetchCurrentWeather, 1000);

let reset = document.getElementById("reset");
reset.addEventListener("click", function(){
    location.reload();
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Taille de la fenêtre
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Taille de la carte
const mapWidth = 5000;
const mapHeight = 5000;

// Position de la "vue" (viewport)
let viewX = 2500;
let viewY = 2500;

// Position des iles
let cervX = 2500;
let cervY = 2500;

let poumX = 1750;
let poumY = 2000;

let foieX = 3250;
let foieY = 3250;

let reinX = 3250;
let reinY = 2000;

let coeurX = 1750;
let coeurY = 3000;

// Vitesse de déplacement
const speed = 3;

// Charger les images
const boatImage = new Image();
boatImage.src = "assets/boat.png";

const cervImage = new Image();
cervImage.src = "assets/cervo.png";
let cervoColl = false;

const poumImage = new Image();
poumImage.src = "assets/poumon.png";
let poumColl = false;

const foieImage = new Image();
foieImage.src = "assets/foie.png";
let foieColl = false;

const reinImage = new Image();
reinImage.src = "assets/rein.png";
let reinColl = false;

const coeurImage = new Image();
coeurImage.src = "assets/coeur.png";
let coeurColl = false;

let popup = false; // Popup affiché ou non

const waterWidth = 100; // Nouvelle largeur de l'eau
const waterHeight = 100; // Nouvelle hauteur de l'eau
const boatWidth = 100; // Nouvelle largeur du bateau
const boatHeight = 100; // Nouvelle hauteur du bateau

// Taille des iles
const cervWidth = 200;
const cervHeight = 200;

const poumWidth = 200;
const poumHeight = 200;

const foieWidth = 200;
const foieHeight = 200;

const reinWidth = 200;
const reinHeight = 200;

const coeurWidth = 200;
const coeurHeight = 200;

createPopup("Bienvenue sur le jeu de la nuit de l'info !\nVotre objectif est de trouver les différentes informations afin de resoudre l'énigme finale!\nPour vous déplacer, utilisez les flèches du clavier.\nBonne chance !");

// Lorsque les images sont chargées
let imagesLoaded = 0;
const onImageLoad = () => {
    imagesLoaded++;
    if (imagesLoaded === 7) {
        requestAnimationFrame(gameLoop);
    }
};

waterImage.onload = onImageLoad;
boatImage.onload = onImageLoad;
cervImage.onload = onImageLoad;
poumImage.onload = onImageLoad;
foieImage.onload = onImageLoad;
reinImage.onload = onImageLoad;
coeurImage.onload = onImageLoad;


// Gérer les touches
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    z: false,
    q: false,
    s: false,
    d: false,
};

window.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

const boatX = canvas.width / 2 - boatWidth / 2;
const boatY = canvas.height / 2 - boatHeight / 2;

function checkCollision(x, y, width, height) {
    return boatX < x + width &&
           boatX + boatWidth > x &&
           boatY < y + height &&
           boatY + boatHeight > y;
}

function createPopup(text) {
    placerLogoAleatoirement()
    popup = true
    let div = document.createElement("div");
    div.innerText = text;
    div.style.fontSize = "24px";
    div.style.backgroundImage = "url('assets/parchemin.png')";
    div.style.backgroundSize = "cover";
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "center";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.textAlign = "center",
    div.style.alignItems = "center";
    div.style.position = "absolute";
    div.style.width = "400px";
    div.style.height = "400px";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.color = "white";
    div.style.paddingLeft = "50px";
    div.style.paddingRight = "350px";
    div.style.borderRadius = "10px";
    div.className = "popup"
    let opacity = 0;
    div.style.opacity = 0;
    const interval = setInterval(() => {
        opacity += 0.1; // Augmente par pas de 0.05
        div.style.opacity = opacity;

        // Stoppe l'intervalle quand l'opacité atteint 1
        if (opacity >= 1) {
            clearInterval(interval);
        }
    }, 50);
    document.body.appendChild(div);
    div.addEventListener("click", () => {
        div.remove();
        popup = false;
        logo.style.display = 'none';
    });
}

function checkAllCollision(){

    if (checkCollision(poumX-viewX, poumY-viewY, poumWidth, poumHeight) && !poumColl){
        poumColl = true;
        createPopup("Les récifs coraliens possèdent une grande biodiversité et génèrent une grande partie de l’oxygène océanique, à l’instar des poumons qui permettent les échanges gazeux dans le corps.\n\nIls sont cepedendant menacés par l’acidification des océans et le réchauffement climatique, provoquant leur blanchissement, semblable à des poumons endommagés par la pollution.")
    }

    if (checkCollision(foieX-viewX, foieY-viewY, foieWidth, foieHeight) && !foieColl){
        foieColl = true;
        createPopup("Le foie est un organe vital qui permet de détoxifier l’organisme, à l’instar des écosystèmes qui permettent de réguler les pollutions.\n\nIl est cependant menacé par la pollution, les pesticides et les métaux lourds, provoquant des maladies et des cancers, semblable à des écosystèmes dégradés par les activités humaines.")
    }

    if (checkCollision(reinX-viewX, reinY-viewY, reinWidth, reinHeight) && !reinColl){
        reinColl = true;
        createPopup("Les reins sont des organes vitaux qui permettent de filtrer le sang et d’éliminer les déchets, à l’instar des rivières qui permettent de réguler les pollutions.\n\nIls sont cependant menacés par la pollution, les pesticides et les métaux lourds, provoquant des maladies et des cancers, semblable à des rivières dégradées par les activités humaines.")
    }

    if (checkCollision(coeurX-viewX, coeurY-viewY, coeurWidth, coeurHeight) && !coeurColl){
        coeurColl = true;
        createPopup("Les courants marins sont des mouvements d’eau qui permettent de réguler la température des océans et de transporter les nutriments, à l’instar du cœur qui permet de réguler la circulation sanguine.\n\nIls sont cependant menacés par le réchauffement climatique et la pollution, provoquant des perturbations des écosystèmes marins, semblable à des troubles cardiaques.")
    }
}

let quiz_effectue = false;
let captcha_effectue = false;

function quiz(){
    if (poumColl && foieColl && reinColl && coeurColl && checkCollision(cervX-viewX, cervY-viewY, cervWidth, cervHeight) && !popup && !quiz_effectue){
        popup = true
        launchCaptcha( () => {

        let div = document.createElement("div");
        div.id = "quiz";
        div.style.fontSize = "24px";
        div.style.backgroundImage = "url('assets/parchemin.png')";
        div.style.backgroundSize = "cover";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        div.style.justifyContent = "center";
        div.style.textAlign = "center",
        div.style.alignItems = "center";
        div.style.position = "absolute";
        div.style.width = "800px";
        div.style.height = "800px";
        div.style.top = "50%";
        div.style.left = "50%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.color = "white";
        div.style.paddingTop = "300px";
        div.style.paddingLeft = "100px";
        div.style.paddingRight = "700px";
        div.style.borderRadius = "10px";
        div.className = "popup"
        let opacity = 0;
        div.style.opacity = 0;
        div.innerHTML = `<p>
            Les récifs coraliens possèdent une grande
            <select id="1">
                <option value="default">-- choisir une réponse --</option>
                <option value="biodiversite">biodiversité</option>
                <option value="pollution">pollution</option>
                <option value="temperature">température</option>
            </select>
            et sont menacés par le changement climatique.
        </p>
        <p>
            Ils génèrent une grande partie
            <select id="2">
                <option value="default">-- choisir une réponse --</option>
                <option value="methane">du méthane</option>
                <option value="oxygene">de l'oxygène</option>
                <option value="co2">du CO2</option>
            </select>
            océanique.
        </p>
        <p>
            Le foie est comme
            <select id="3">
                <option value="default">-- choisir une réponse --</option>
                <option value="plancton">le plancton</option>
                <option value="coraux">les coraux</option>
                <option value="ecosysteme">les écosystèmes</option>
            </select>
            : il régule les pollutions.
        </p>
        <p>
            Comme l'organe humain, ils subissent
            <select id="4">
                <option value="default">-- choisir une réponse --</option>
                <option value="stress">du stress</option>
                <option value="pollution">de la pollution</option>
                <option value="temperature">des variations de température</option>
            </select>
            les dégradant ainsi.
        </p>
        <p>
            Les rivières sont ont pour équivalent, dans le corps humain, les
            <select id="5">
                <option value="default">-- choisir une réponse --</option>
                <option value="veines">veines</option>
                <option value="poumons">poumons</option>
                <option value="reins">reins</option>
            </select>
            .
        </p>
        <p>
            Les courants marins sont comme
            <select id="6">
                <option value="default">-- choisir une réponse --</option>
                <option value="coeur">le coeur</option>
                <option value="poumons">les poumons</option>
                <option value="reins">les reins</option>
            </select>
            : ils régulent la température et apportent les nutriments aux ecosystèmes.
        </p>
        <input type="button" value="Valider" onclick="checkReponses()">`;
        const interval = setInterval(() => {
        opacity += 0.1; // Augmente par pas de 0.05
        div.style.opacity = opacity;

        // Stoppe l'intervalle quand l'opacité atteint 1
        if (opacity >= 1) {
            clearInterval(interval);
        }
        }, 50);
        document.body.appendChild(div);
    });
    }
    else if (checkCollision(cervX-viewX, cervY-viewY, cervWidth, cervHeight) && !cervoColl && !popup && !quiz_effectue){
        createPopup("Vous n'avez pas encore trouvé toutes les informations nécessaires pour résoudre l'énigme...")
        cervoColl = true;
    }
}

function launchCaptcha(callback) {
    // Conteneur principal
    const captchaContainer = document.getElementById("captcha-container");
    captchaContainer.innerHTML = ""; // Réinitialise le conteneur
    captchaContainer.style.display = "flex";
    captchaContainer.style.flexDirection = "column";
    captchaContainer.style.alignItems = "center";
    captchaContainer.style.marginTop = "20px";
    captchaContainer.style.backgroundColor = "#fff";

    // Création du conteneur de jeu
    const gameContainer = document.createElement("div");
    gameContainer.id = "game-container";
    Object.assign(gameContainer.style, {
      position: "relative",
      width: "400px",
      height: "400px",
      background: "linear-gradient(to bottom, #87CEEB 70%, #ffffff 30%)",
      border: "2px solid #ccc",
      borderRadius: "10px",
      overflow: "hidden",
    });

    // Message pour l'utilisateur
    const message = document.createElement("div");
    message.id = "message";
    message.style.marginTop = "20px";
    message.style.fontSize = "18px";
    message.style.color = "#333";
    message.textContent = "Cliquez sur le bateau rouge !";

    // Ajout au conteneur principal
    captchaContainer.appendChild(gameContainer);
    captchaContainer.appendChild(message);

    const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
    const boats = [];
    const boatCount = 6;
    let targetColor = "";
    let success = false;

    // Fonction pour créer un bateau (SVG intégré dans DOM)
    function createBoat(color) {
      const boat = document.createElement("div");
      boat.className = "boat";
      boat.dataset.color = color;
      Object.assign(boat.style, {
        position: "absolute",
        width: "60px",
        height: "60px",
        cursor: "pointer",
      });

      // SVG du bateau
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60">
          <rect x="20" y="60" width="60" height="10" fill="${color}" />
          <rect x="48" y="30" width="4" height="30" fill="black" />
          <polygon points="50,30 50,60 30,60" fill="${color}" opacity="0.8" />
          <polygon points="50,30 50,60 70,60" fill="${color}" opacity="0.6" />
        </svg>`;
      boat.innerHTML = svg;

      // Positionnement aléatoire
      const randomX = Math.floor(Math.random() * (gameContainer.offsetWidth - 60));
      const randomY = Math.floor(Math.random() * (gameContainer.offsetHeight - 60));
      boat.style.left = `${randomX}px`;
      boat.style.top = `${randomY}px`;

      // Ajout de l'événement de clic
      boat.addEventListener("click", () => {
        if (success) return;
        if (boat.dataset.color === targetColor) {
          success = true;
          message.textContent = "Bravo ! Vous avez cliqué sur le bon bateau 🎉";
          captcha_effectue = true;
          document.getElementById("captcha-container").remove();
          callback()
        } else {
          message.textContent = `Mauvais choix ! Essayez encore de cliquer sur le bateau ${targetColor} !`;
        }
      });

      gameContainer.appendChild(boat);
      boats.push(boat);
    }

    // Choisir une couleur cible
    function chooseTargetColor() {
      const randomIndex = Math.floor(Math.random() * colors.length);
      targetColor = colors[randomIndex];
      message.textContent = `Cliquez sur le bateau ${targetColor} !`;
    }

    // Déplacer les bateaux de manière aléatoire
    function moveBoats() {
      boats.forEach((boat) => {
        const maxX = gameContainer.offsetWidth - boat.offsetWidth;
        const maxY = gameContainer.offsetHeight - boat.offsetHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        boat.style.left = `${randomX}px`;
        boat.style.top = `${randomY}px`;
      });
    }

    // Initialisation du CAPTCHA
    for (let i = 0; i < boatCount; i++) {
      createBoat(colors[i]);
    }
    chooseTargetColor();

    // Déplacement des bateaux toutes les 800ms
    const moveInterval = setInterval(() => {
      if (success) clearInterval(moveInterval);
      moveBoats();
    }, 800);
}

function checkReponses(){
    let quiz_popup = document.getElementById("quiz");
    const reponses = {
        1: "biodiversite",
        2: "oxygene",
        3: "ecosysteme",
        4: "pollution",
        5: "reins",
        6: "coeur"
    }
    let correct = 0;
    for (let i = 1; i <= 6; i++){
        let select = document.getElementById(i.toString());
        if (select.value === reponses[i]){
            correct++;
        }
    }
    quiz_popup.remove();    
    createPopup(`Vous avez trouvé ${correct} bonnes réponses sur 6.`);
    quiz_effectue = true;
}

// Boucle de jeu
function gameLoop() {
    // Déplacement en fonction des touches
    if ((keys.ArrowUp || keys.z) && !popup) viewY = Math.max(0, viewY - speed);
    if ((keys.ArrowDown || keys.s) && !popup) viewY = Math.min(mapHeight - canvas.height, viewY + speed);
    if ((keys.ArrowLeft || keys.q) && !popup) viewX = Math.max(0, viewX - speed);
    if ((keys.ArrowRight || keys.d) && !popup) viewX = Math.min(mapWidth - canvas.width, viewX + speed);

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner la carte (mosaïque de l'image)
    for (let y = 0; y < mapHeight; y += waterHeight) {
        for (let x = 0; x < mapWidth; x += waterWidth) {
            ctx.drawImage(waterImage, x - viewX, y - viewY, waterWidth, waterHeight);
        }
    }
    // Dessiner le bateau au centre de la vue
    const boatX = canvas.width / 2 - boatWidth / 2;
    const boatY = canvas.height / 2 - boatHeight / 2;
    ctx.drawImage(cervImage, cervX-viewX, cervY-viewY, cervWidth, cervHeight);
    ctx.drawImage(poumImage, poumX-viewX, poumY-viewY, poumWidth, poumHeight);
    ctx.drawImage(foieImage, foieX-viewX, foieY-viewY, foieWidth, foieHeight);
    ctx.drawImage(reinImage, reinX-viewX, reinY-viewY, reinWidth, reinHeight);
    ctx.drawImage(coeurImage, coeurX-viewX, coeurY-viewY, coeurWidth, coeurHeight);
    ctx.drawImage(boatImage, boatX, boatY, boatWidth, boatHeight);

    if (meteo_code === 1) {
        ctx.drawImage(weatherImage, canvas.width - weatherWidth, 0, weatherWidth, weatherHeight);
    }
    else if (meteo_code === 2) {
        for (let i = 0; i < canvas.width; i += weatherWidth) {
            ctx.drawImage(weatherImage, i, 0, weatherWidth, weatherHeight);
        }
    }
    else{
        for (let i = 0; i < canvas.width; i += weatherWidth) {
            ctx.drawImage(weatherImage, i, 0, weatherWidth, weatherHeight);
            }
    }

    checkAllCollision();
    quiz();

    requestAnimationFrame(gameLoop);
}





// Fonction pour positionner le logo aléatoirement
function placerLogoAleatoirement() {
    logo.style.display = 'block'
    logo.style.width = "10%";
    logo.style.height = "10%";
    logo.src = images
    const windowWidth = window.innerWidth - 100; // 100 pour la largeur de l'image
    const windowHeight = window.innerHeight - 100; // 100 pour la hauteur de l'image

    const posX = Math.floor(Math.random() * windowWidth);
    const posY = Math.floor(Math.random() * windowHeight);

    logo.style.left = `${posX}px`;
    logo.style.top = `${posY}px`;
}

// Fonction pour afficher le Rick Roll
function afficherRickRoll() {
    logo.style.display = 'none'; // Masquer le logo
    gif.style.display = 'block'; // Afficher le GIF
    audio.play(); // Joue l'audio de Rick Roll

    // Masquer le GIF après 5 secondes
    setTimeout(() => {
        gif.style.display = 'none'; // Masquer le GIF
        logo.style.display = 'block'; // Afficher le logo
    }, 5000);
}

logo.addEventListener('click', afficherRickRoll);