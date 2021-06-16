"use strict";
import {context, spriteSheet, size} from "./main.js";
export default class DisplayObject {
    constructor(coordX, coordY, width, height,
        coordXFromSprite, coordYFromSprite) {
        this.coordXcanvas = coordX * size;
        this.coordYcanvas = coordY * size;
        this.widthFromSprite = width;
        this.heightFromSprite = height;
        this.image = spriteSheet;
        this.coordXFromSprite = coordXFromSprite;
        this.coordYFromSprite = coordYFromSprite;
        this.width = width * size;
        this.height = height * size;
    }

    draw() {
        context.drawImage(this.image, this.coordXFromSprite,
            this.coordYFromSprite, this.widthFromSprite, this.heightFromSprite,
            this.coordXcanvas, this.coordYcanvas, this.width, this.height);
    }

    drawMovingElement(currentX, currentY) {
        context.drawImage(this.image, this.coordXFromSprite,
            this.coordYFromSprite, this.widthFromSprite, this.heightFromSprite,
            currentX, currentY, this.width, this.height);
    }
}