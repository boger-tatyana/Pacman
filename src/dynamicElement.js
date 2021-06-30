"use strict";
import DisplayObject from "./displayObject.js";
import {
    directionEnum,
    size,
    walls
} from "./main.js";

export default class DynamicElement {
    constructor(atlasElement = [], position = {}) {
        this.atlasPosition = position;
        this.duration = atlasElement[0].duration / atlasElement[0].frames.length;
        this.width = atlasElement[0].frames[0].width * size;
        this.height = atlasElement[0].frames[0].height * size;
        this.abandonState();
        atlasElement.forEach(element => {
            if (element.name === "right") {
                this.framesRight = this.extractFramesFromAtlas(element, position);
            }

            if (element.name === "left") {
                this.framesLeft = this.extractFramesFromAtlas(element, position);
            }

            if (element.name === "down") {
                this.framesDown = this.extractFramesFromAtlas(element, position);
            }
            
            if (element.name === "up") {
                this.framesUp = this.extractFramesFromAtlas(element, position);
            }
        });
    }

    abandonState() {
        this.coordinateX = this.atlasPosition.x * size;
        this.coordinateY = this.atlasPosition.y * size;
        this.frameNumber = 0;
        this.frameStartTimestamp = 0;
        this.direction = this.atlasPosition.direction;
        this.nextDirection = null;
        this.frozen = true;
    }

    extractFramesFromAtlas(element = {}, position = {}) {
        let frames = [];
        element.frames.forEach(frame => {
            frames.push(new DisplayObject(
                position.x, position.y,
                frame.width,
                frame.height,
                frame.x,
                frame.y
            ));
        });
        return frames;
    }
}