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

const openMusic = document.querySelector(".opening");
const eatingMusic = document.querySelector(".eating");
const deathMusic = document.querySelector(".die");
const greeting = document.querySelector(".modal");
const gameStart = document.querySelector(".modal-start");
const myScore = document.querySelector(".score");
const gameOver = document.querySelector(".game-over");
const newGameStart = document.querySelector(".modal-new-start");
const newGameStart2 = document.querySelector(".modal-new-start-2");
const winGame = document.querySelector(".win");
const waitingStart = 5500;
const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
const context = canvas.getContext("2d");
const directionEnum = Object.freeze({
    LEFT: "left",
    UP: "up",
    RIGHT: "right",
    DOWN: "down"
});
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
const walls = [];
atlas.maze.walls.forEach(element => {
    walls.push(new Wall(element));
});

let score = 0;
let pacmanDeathTimestamp;
let foods = [];

ghosts.push(new Ghost(atlas.redGhost, atlas.position.red));
ghosts.push(new Ghost(atlas.pinkGhost, atlas.position.pink));
ghosts.push(new Ghost(atlas.turquoiseGhost, atlas.position.turquoise));
ghosts.push(new Ghost(atlas.bananaGhost, atlas.position.banana));

document.querySelector(".modal-start").onclick = function () {
    startGame();
    render(0);
};

gameStart.addEventListener("click", function startGame() {
    greeting.style.display = "none";
    myScore.classList.remove("blur");
});

newGameStart2.addEventListener("click", function startNewGame() {
    winGame.style.display = "none";
    startGame();
});

newGameStart.addEventListener("click", function startNewGame() {
    gameOver.style.display = "none";
    startGame();
});

 //add event listener for pacman control
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "Down":
        case "ArrowDown":
            pacman.nextDirection = directionEnum.DOWN;
            break;
        case "Up": // IE/Edge specific value
        case "ArrowUp":
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
});

document.body.append(canvas);

//Functions:

function startGame() {
    openMusic.play();
    foods = [];
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
    pacman.abandonState();
    pacmanDeathTimestamp = undefined;
    score = 0;
    ghosts.forEach(ghost => {
        ghost.abandonState();
    });
}

function render(timestamp) {
    requestAnimationFrame((timestamp) => render(timestamp));
    clearCanvas();
    drawBackground();
    drawFood();
    drawPacman(timestamp);
    if (pacmanDeathTimestamp !== undefined && pacmanDeathTimestamp + 1500 < timestamp) {
        gameOver.style.display = "block";
    }
    if (timestamp > waitingStart && pacman.alive) {
        ghosts.forEach(ghost => {
            ghost.frozen = false;
        });
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
            eatingMusic.play();
            if (foods.length < 200) {
                winGame.style.display = "block";
                ghosts.forEach(ghost => {
                    ghost.frozen = true;
                });
                pacman.direction = null;
                pacman.nextDirection = null;
            }
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
        if (pacman.alive) {
            deathMusic.play();
        }
        pacman.alive = false;
        ghosts.forEach(ghost => {
            ghost.frozen = true;
        });
    }
}