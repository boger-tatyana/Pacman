"use strict";
import DisplayObject from "./displayObject.js";
import DynamicElement from "./dynamicElement.js";
import {
    directionEnum,
    walls
} from "./main.js";


export default class Pacman extends DynamicElement {
    constructor(atlasElement = [], position = {}) {
        super(atlasElement, position);
        this.alive = true;
        atlasElement.forEach(element => {
            if (element.name === "die") {
                this.deathFrames = [];
                element.frames.forEach(frame => {
                    this.deathFrames.push(new DisplayObject(
                        position.x, position.y,
                        frame.width,
                        frame.height,
                        frame.x,
                        frame.y
                    ));
                });
            }
        });
        document.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "Down": // IE/Edge specific value
                case "ArrowDown":
                    this.nextDirection = directionEnum.DOWN;
                    break;
                case "Up": // IE/Edge specific value
                case "ArrowUp":
                    //pacman.direction = directionEnum.UP;
                    this.nextDirection = directionEnum.UP;
                    break;
                case "Left": // IE/Edge specific value
                case "ArrowLeft":
                    this.nextDirection = directionEnum.LEFT;
                    break;
                case "Right": // IE/Edge specific value
                case "ArrowRight":
                    this.nextDirection = directionEnum.RIGHT;
                    break;
            }
        });
    }

    drawAnimation(timestamp) {
        let currentDirectionFrames;
        if (!this.alive) {
            this.direction = null;
            this.nextDirection = null;
            currentDirectionFrames = this.deathFrames;
        };
        this.newCoordinateX = this.coordinateX;
        this.newCoordinateY = this.coordinateY;

        if (this.nextDirection !== null && this.nextDirection !== undefined) {
            switch (this.nextDirection) {
                case directionEnum.RIGHT:
                    currentDirectionFrames = this.framesRight;
                    this.newCoordinateX += 5;
                    break;
                case directionEnum.LEFT:
                    currentDirectionFrames = this.framesLeft;
                    this.newCoordinateX -= 5;
                    break;
                case directionEnum.UP:
                    currentDirectionFrames = this.framesUp;
                    this.newCoordinateY -= 5;
                    break;
                case directionEnum.DOWN:
                    currentDirectionFrames = this.framesDown;
                    this.newCoordinateY += 5;
                    break;
                default:
                    break;
            }

            let collision = false;
            walls.forEach(wall => {
                if (wall.collisionCheck(this)) {
                    collision = true;
                }
            });

            if (!collision) {
                this.direction = this.nextDirection;
                this.nextDirection = null;
            }
        }
        this.newCoordinateX = this.coordinateX;
        this.newCoordinateY = this.coordinateY;
        switch (this.direction) {
            case directionEnum.RIGHT:
                currentDirectionFrames = this.framesRight;
                this.newCoordinateX += 1;
                break;
            case directionEnum.LEFT:
                currentDirectionFrames = this.framesLeft;
                this.newCoordinateX -= 1;
                break;
            case directionEnum.UP:
                currentDirectionFrames = this.framesUp;
                this.newCoordinateY -= 1;
                break;
            case directionEnum.DOWN:
                currentDirectionFrames = this.framesDown;
                this.newCoordinateY += 1;
                break;
            default:
                break;
        }

        walls.forEach(wall => {
            if (wall.collisionCheck(this)) {
                this.direction = null;
                console.log("COLLISION");
            }
        });
        if (this.direction != null) {
            this.coordinateX = this.newCoordinateX;
            this.coordinateY = this.newCoordinateY;
        }

        if (this.frozen === true) {

        };

        if (this.alive && (this.direction === null || this.direction === undefined)) {
            // если у динамик элеманта нет направления(пакман),
            // то выполнение метода прерывается и мы никуда не двигаем его.
            this.framesRight[0].drawMovingElement(this.coordinateX, this.coordinateY);
            return;
        }

        currentDirectionFrames[this.frameNumber].drawMovingElement(this.coordinateX, this.coordinateY);
        if (timestamp - this.frameStartTimestamp >= this.duration) {
            this.frameStartTimestamp = timestamp;
            if (this.frameNumber < currentDirectionFrames.length - 1) {
                this.frameNumber += 1;
            } else {
                this.frameNumber = 0;
            }
        }
    }

    pacmanDeathCheck(ghosts = []) {
        let collision = false;
        ghosts.forEach(ghost => {
            if ((this.coordinateY + this.height > ghost.coordinateY) &&
                (this.coordinateY < ghost.coordinateY + ghost.height) &&
                (this.coordinateX + this.width > ghost.coordinateX) &&
                (this.coordinateX < ghost.coordinateX + ghost.width)) {
                collision = true;
            }
        });
        return collision;
    }
}