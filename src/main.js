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

let poumX = 2250;
let poumY = 2250;

// Vitesse de déplacement
const speed = 3;

// Charger les images
const waterImage = new Image();
waterImage.src = "assets/water.png";

const boatImage = new Image();
boatImage.src = "assets/boat.png";

const cervImage = new Image();
cervImage.src = "assets/cervo.png";
let cervoColl = false;

const poumImage = new Image();
poumImage.src = "assets/poumon.png";
let poumColl = false;

let popup = false; // Popup affiché ou non

// Taille des images
const waterWidth = 100; // Nouvelle largeur de l'eau
const waterHeight = 100; // Nouvelle hauteur de l'eau
const boatWidth = 100; // Nouvelle largeur du bateau
const boatHeight = 100; // Nouvelle hauteur du bateau

// Taille des iles
const cervWidth = 200; // Nouvelle largeur du cervo
const cervHeight = 200; // Nouvelle hauteur du cervo

const poumWidth = 200;
const poumHeight = 200;

createPopup("Bienvenue sur le jeu de la nuit de l'info !\nVotre objectif est de trouver les différentes informations afin de resoudre l'énigme finale!\nPour vous déplacer, utilisez les flèches du clavier.\nBonne chance !");

// Lorsque les images sont chargées
let imagesLoaded = 0;
const onImageLoad = () => {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        requestAnimationFrame(gameLoop);
    }
};

waterImage.onload = onImageLoad;
boatImage.onload = onImageLoad;
cervImage.onload = onImageLoad;
poumImage.onload = onImageLoad;


// Gérer les touches
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
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
    popup = true
    let div = document.createElement("div");
    div.innerText = text;
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.textAlign = "center",
    div.style.alignItems = "center";
    div.style.position = "absolute";
    div.style.width = "400px";
    div.style.minHeight = "100px";
    div.style.height = "fit-content";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.backgroundColor = "black";
    div.style.color = "white";
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
    });
}

function checkAllCollision(){
    if (checkCollision(cervX-viewX, cervY-viewY, cervWidth, cervHeight) && !cervoColl){
        cervoColl = true;
        createPopup("L'ile aux énigmes");
    }

    if (checkCollision(poumX-viewX, poumY-viewY, poumWidth, poumHeight) && !poumColl){
        poumColl = true;
        createPopup("Les poumons")
    }
}

// Boucle de jeu
function gameLoop() {
    // Déplacement en fonction des touches
    if (keys.ArrowUp && !popup) viewY = Math.max(0, viewY - speed);
    if (keys.ArrowDown && !popup) viewY = Math.min(mapHeight - canvas.height, viewY + speed);
    if (keys.ArrowLeft && !popup) viewX = Math.max(0, viewX - speed);
    if (keys.ArrowRight && !popup) viewX = Math.min(mapWidth - canvas.width, viewX + speed);

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
    ctx.drawImage(boatImage, boatX, boatY, boatWidth, boatHeight);
    checkAllCollision();

    requestAnimationFrame(gameLoop);
}