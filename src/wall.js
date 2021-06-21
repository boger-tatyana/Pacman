"use strict";
import {size} from "./main.js";
export default class Wall {
    constructor (wall = {}) {
        this.x = wall.x * size;
        this.y = wall.y * size;
        this.width = wall.width * size;
        this.height = wall.height * size;
    }

    collisionCheck(dynamicElement = {}) {
        return ((dynamicElement.newCoordinateY + dynamicElement.height > this.y) 
        && (dynamicElement.newCoordinateY < this.y + this.height)
            && (dynamicElement.newCoordinateX + dynamicElement.width > this.x)
            && (dynamicElement.newCoordinateX < this.x + this.width));

    };
}