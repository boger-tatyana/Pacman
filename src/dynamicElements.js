"use strict";
import {
    atlas
} from "../atlas.js";
import DisplayObject from "./displayObject.js";
import {
    directionEnum, size, walls
} from "./main.js";
import Food from "./food.js";

export default class DynamicElements {
    constructor(atlasElement = [], position = {}) {
        this.frameNumber = 0;
        this.frameStartTimestamp = 0;
        this.direction = position.direction;
        this.duration = atlasElement[0].duration;
        this.width = atlasElement[0].frames[0].width * size;
        this.height = atlasElement[0].frames[0].height * size;
        this.coordinateX = position.x * size;
        this.coordinateY = position.y * size;
        atlasElement.forEach(element => {
            if (element.name === "right") {
                this.framesRight = [];
                element.frames.forEach(frame => {
                    this.framesRight.push(new DisplayObject(
                        position.x, position.y,
                        frame.width,
                        frame.height,
                        frame.x,
                        frame.y
                    ));
                });
            }
        });

        atlasElement.forEach(element => {
            if (element.name === "left") {
                this.framesLeft = [];
                element.frames.forEach(frame => {
                    this.framesLeft.push(new DisplayObject(
                        position.x, position.y,
                        frame.width,
                        frame.height,
                        frame.x,
                        frame.y
                    ));
                });
            }
        });

        atlasElement.forEach(element => {
            if (element.name === "down") {
                this.framesDown = [];
                element.frames.forEach(frame => {
                    this.framesDown.push(new DisplayObject(
                        position.x, position.y,
                        frame.width,
                        frame.height,
                        frame.x,
                        frame.y
                    ));
                });
            }
        });

        atlasElement.forEach(element => {
            if (element.name === "up") {
                this.framesUp = [];
                element.frames.forEach(frame => {
                    this.framesUp.push(new DisplayObject(
                        position.x, position.y,
                        frame.width,
                        frame.height,
                        frame.x,
                        frame.y
                    ));
                });
            }
        });
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

        if (this.direction === null || this.direction === undefined) {
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
}