"use strict";
import DynamicElements from "./dynamicElements.js";
import DisplayObject from "./displayObject.js";
import Wall from "./wall.js";
import {
    atlas
} from "../atlas.js";
export {
    context,
    spriteSheet,
    size,
    directionEnum
};

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const directionEnum = Object.freeze({
    LEFT: "left",
    UP: "up",
    RIGHT: "right",
    DOWN: "down"
});
canvas.width = 700;
canvas.height = 700;

const size = 2;

const spriteSheet = new Image();
spriteSheet.src = '../sets/original.png';

const maze = new DisplayObject(0, 0,
    atlas.maze.width,
    atlas.maze.height,
    atlas.maze.x,
    atlas.maze.y);

const pacman = new DynamicElements(atlas.pacman, atlas.position.pacman);
const redGhost = new DynamicElements(atlas.redGhost, atlas.position.red);
const pinkGhost = new DynamicElements(atlas.pinkGhost, atlas.position.pink);
const turquoiseGhost = new DynamicElements(atlas.turquoiseGhost, atlas.position.turquoise);
const bananaGhost = new DynamicElements(atlas.bananaGhost, atlas.position.banana);
const walls = [];
atlas.maze.walls.forEach(element => {
    walls.push(new Wall(element));
    
});
console.log(walls);

let foods = [];
atlas.maze.foods.forEach(atlasFood => {
    foods.push(new DisplayObject(
        atlasFood.x,
        atlasFood.y,
        atlasFood.width,
        atlasFood.height,
        atlasFood.x,
        atlasFood.y
    ));
});

spriteSheet.onload = (timestamp) => {
    console.log(timestamp);
    render(timestamp);
}

function render(timestamp) {
    console.log(timestamp);
    requestAnimationFrame((timestamp) => render(timestamp));
    clearCanvas();
    drawBackground();
    drawFood();
    drawPacman(timestamp);
    drawRedGhost(timestamp);
    drawPinkGhost(timestamp);
    drawTurquoiseGhost(timestamp);
    drawBananaGhost(timestamp);

}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground() {
    maze.draw();
}

function drawFood() {
    for (let i = 0; i < foods.length; i++) {
        foods[i].draw();
    }
}

function drawPacman(timestamp) {
    pacman.drawAnimation(timestamp);
    walls.forEach(wall => {
        if (wall.collisionCheck(pacman)) {
            pacman.direction = null;
            console.log("COLLISION");
        }
    });
}

function drawRedGhost(timestamp) {
    redGhost.drawAnimation(timestamp);
}

function drawPinkGhost(timestamp) {
    pinkGhost.drawAnimation(timestamp);
}

function drawTurquoiseGhost(timestamp) {
    turquoiseGhost.drawAnimation(timestamp);
}

function drawBananaGhost(timestamp) {
    bananaGhost.drawAnimation(timestamp);
}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "Down": // IE/Edge specific value
        case "ArrowDown":
            pacman.direction = directionEnum.DOWN;
            break;
        case "Up": // IE/Edge specific value
        case "ArrowUp":
            pacman.direction = directionEnum.UP;
            break;
        case "Left": // IE/Edge specific value
        case "ArrowLeft":
            pacman.direction = directionEnum.LEFT;
            break;
        case "Right": // IE/Edge specific value
        case "ArrowRight":
            pacman.direction = directionEnum.RIGHT;
            break;
    }
})
document.body.append(canvas);