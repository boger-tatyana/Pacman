"use strict";
import {size} from "./main.js";
export default class Wall {
    constructor (wall = {}) {
        this.x = wall.x;
        this.y = wall.y;
        this.width = wall.width * size;
        this.height = wall.height * size;
    }

    collisionCheck(dynamicElement = {}) {
        return ((dynamicElement.coordinateY + dynamicElement.height >= this.y) 
        && (dynamicElement.coordinateY < this.y + this.height)
            && (dynamicElement.coordinateX + dynamicElement.width > this.x)
            && (dynamicElement.coordinateX < this.x + this.width));

    };
}