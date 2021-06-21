"use strict";
import DisplayObject from "./displayObject.js";
export default class Food extends DisplayObject {
    collisionCheck(dynamicElement = {}) {
        return ((dynamicElement.newCoordinateY + dynamicElement.height >= this.coordYcanvas) 
        && (dynamicElement.newCoordinateY <= this.coordYcanvas + this.height)
            && (dynamicElement.newCoordinateX + dynamicElement.width >= this.coordXcanvas)
            && (dynamicElement.newCoordinateX <= this.coordXcanvas + this.width));

    };
};