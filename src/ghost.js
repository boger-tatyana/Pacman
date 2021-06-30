"use strict";
import {
    directionEnum,
    walls
} from "./main.js";
import DynamicElement from "./dynamicElement.js";

export default class Ghost extends DynamicElement {
    constructor(atlasElement = [], position = {}) {
        super(atlasElement, position);
    }

    drawAnimation(timestamp) {
        let currentDirectionFrames;
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

        let initialCollision = false;
        walls.forEach(wall => {
            if (wall.collisionCheck(this)) {
                initialCollision = true;
                let directions = Object.values(directionEnum);
                let index = directions.indexOf(this.direction);
                directions.splice(index, 1);
                let oppositeDirection = this.getOppositeDirection(this.direction);
                index = directions.indexOf(oppositeDirection);
                directions.splice(index, 1);
                let chosenIndex = this.getRandomIntInclusive(0, 1);
                this.direction = directions[chosenIndex];

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

                let collision = false;
                walls.forEach(wall => {
                    if (wall.collisionCheck(this)) {
                        collision = true;
                    }
                });
                if (collision == true) {
                    index = directions.indexOf(this.direction);
                    directions.splice(index, 1);
                    this.direction = directions[0];
                } else {
                    this.coordinateX = this.newCoordinateX;
                    this.coordinateY = this.newCoordinateY;
                }
            }
        });
        if (initialCollision == false && !this.frozen) {
            this.coordinateX = this.newCoordinateX;
            this.coordinateY = this.newCoordinateY;
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

    getOppositeDirection(direction) {
        switch (direction) {
            case directionEnum.RIGHT:
                return directionEnum.LEFT;
            case directionEnum.LEFT:
                return directionEnum.RIGHT;
            case directionEnum.UP:
                return directionEnum.DOWN;
            case directionEnum.DOWN:
                return directionEnum.UP;
        }
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}