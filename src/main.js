"use strict";
import DisplayObject from "./displayObject.js";
import Pacman from "./pacman.js";
import Ghost from "./ghost.js";
import Wall from "./wall.js";
import Food from "./food.js";
import {
    atlas
} from "../atlas.js";
export {
    context,
    spriteSheet,
    size,
    directionEnum,
    walls
};

/*let openMusic = document.querySelector(".opening"); - музыка играет 
сразу при нажатии в любом месте
document.addEventListener("click", musicPlay);
function musicPlay() {
    openMusic.play();
    document.removeEventListener("click", musicPlay);
}
*/
let openMusic = document.querySelector(".opening"); //музыка играет после нажатия 
//на кнопку
document.querySelector(".modal-start").onclick = function () {
    if (openMusic.paused == true) {
        openMusic.play();
    } else if (openMusic.paused == false) {
        openMusic.pause();
    }
};
const greeting = document.querySelector(".modal");
const gameStart = document.querySelector(".modal-start");
const navigation = document.querySelector(".navigation");
const gameOver = document.querySelector(".game-over");

gameStart.addEventListener("click", function startGame() {
    greeting.style.display = "none";
    navigation.classList.remove("blur");
});
//gameStart.removeEventListener("click", function startGame() ); //невозможно вызвать

let score = 0;
let pacmanDeathTimestamp;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const directionEnum = Object.freeze({
    LEFT: "left",
    UP: "up",
    RIGHT: "right",
    DOWN: "down"
});
canvas.width = 500;
canvas.height = 500;
const size = 2;

const spriteSheet = new Image();
spriteSheet.src = '../sets/original.png';

const maze = new DisplayObject(0, 0,
    atlas.maze.width,
    atlas.maze.height,
    atlas.maze.x,
    atlas.maze.y);

const pacman = new Pacman(atlas.pacman, atlas.position.pacman);
const ghosts = [];
ghosts.push(new Ghost(atlas.redGhost, atlas.position.red));
ghosts.push(new Ghost(atlas.pinkGhost, atlas.position.pink));
ghosts.push(new Ghost(atlas.turquoiseGhost, atlas.position.turquoise));
ghosts.push(new Ghost(atlas.bananaGhost, atlas.position.banana));
const walls = [];
atlas.maze.walls.forEach(element => {
    walls.push(new Wall(element));

});
console.log(walls);

let foods = [];
atlas.maze.foods.forEach(atlasFood => {
    foods.push(new Food(
        atlasFood.x,
        atlasFood.y,
        atlasFood.width,
        atlasFood.height,
        atlasFood.x,
        atlasFood.y
    ));
});
console.log(foods);

spriteSheet.onload = (timestamp) => {
    //console.log(timestamp);
    render(timestamp);
}

function render(timestamp) {
    //console.log(timestamp);
    requestAnimationFrame((timestamp) => render(timestamp));
    clearCanvas();
    drawBackground();
    drawFood();
    drawPacman(timestamp);
    if (pacmanDeathTimestamp !== undefined && pacmanDeathTimestamp + 1500 < timestamp) {


        gameOver.style.display = "block";


    }
    ghosts.forEach(ghost => {
        ghost.drawAnimation(timestamp);
    });

}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground() {
    maze.draw();
}

function drawFood() {
    for (let i = 0; i < foods.length; i++) {

        if (foods[i].collisionCheck(pacman)) {
            foods.splice(i, 1);
            score++;

        } else {
            foods[i].draw();
        }
        document.querySelector(".score").innerHTML = "Очки: " + score * 10;
    }
}

function drawPacman(timestamp) {
    pacman.drawAnimation(timestamp);
    if (pacman.pacmanDeathCheck(ghosts)) {
        if (pacmanDeathTimestamp == undefined) {
            pacmanDeathTimestamp = timestamp;
        }
        pacman.alive = false;
        ghosts.forEach(ghost => {
            ghost.frozen = true;
        });
    };

}


document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "Down": // IE/Edge specific value
        case "ArrowDown":
            pacman.nextDirection = directionEnum.DOWN;
            break;
        case "Up": // IE/Edge specific value
        case "ArrowUp":
            //pacman.direction = directionEnum.UP;
            pacman.nextDirection = directionEnum.UP;
            break;
        case "Left": // IE/Edge specific value
        case "ArrowLeft":
            pacman.nextDirection = directionEnum.LEFT;
            break;
        case "Right": // IE/Edge specific value
        case "ArrowRight":
            pacman.nextDirection = directionEnum.RIGHT;
            break;
    }
})



document.body.append(canvas);