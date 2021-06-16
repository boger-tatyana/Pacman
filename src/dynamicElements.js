"use strict";
import {
    atlas
} from "../atlas.js";
import DisplayObject from "./displayObject.js";
import {
    directionEnum
} from "./main.js";

export default class DynamicElements {
    constructor(atlasElement = [], position = {}) {
        this.frameNumber = 0;
        this.frameStartTimestamp = 0;
        this.direction = position.direction;
        this.duration = atlasElement[0].duration;
        this.width = atlasElement[0].frames[0].width;
        this.height = atlasElement[0].frames[0].height;
        this.coordinateX = position.x;
        this.coordinateY = position.y;
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
        switch (this.direction) {
            case directionEnum.RIGHT:
                currentDirectionFrames = this.framesRight;
                this.coordinateX += 1;
                break;
            case directionEnum.LEFT:
                currentDirectionFrames = this.framesLeft;
                this.coordinateX -= 1;
                break;
            case directionEnum.UP:
                currentDirectionFrames = this.framesUp;
                this.coordinateY -= 1;
                break;
            case directionEnum.DOWN:
                currentDirectionFrames = this.framesDown;
                this.coordinateY += 1;
                break;
            default:
                break;
        }

        if (this.direction === null || this.direction === undefined) {
            this.framesRight[0].drawMovingElement(this.coordinateX, this.coordinateY);
            return;
        } // если у динамик элеманта нет направления(пакман),
         // то выполнение метода прерывается и мы никуда не двигаем его.

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