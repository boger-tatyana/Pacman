"use strict";
import DynamicElement from "./dynamicElement.js";
import {
    directionEnum,
    walls
} from "./main.js";


export default class Pacman extends DynamicElement {
    constructor(atlasElement = [], position = {}) {
        super(atlasElement, position);
        this.abandonState();
        //add frames of Pacman death
        atlasElement.forEach(element => {
            if (element.name === "die") {
                this.deathFrames = super.extractFramesFromAtlas(element, position);
            }
        });
    }

    drawAnimation(timestamp) {
        let currentDirectionFrames;
        if (!this.alive) {
            this.direction = null;
            this.nextDirection = null;
            currentDirectionFrames = this.deathFrames;
        }

        this.newCoordinateX = this.coordinateX;
        this.newCoordinateY = this.coordinateY;
        //check if user entered next direction for pacman and if pacman can turn that way
        if (this.nextDirection !== null && this.nextDirection !== undefined) {
            switch (this.nextDirection) {
                case directionEnum.RIGHT:
                    currentDirectionFrames = this.framesRight;
                    this.newCoordinateX += 3;
                    break;
                case directionEnum.LEFT:
                    currentDirectionFrames = this.framesLeft;
                    this.newCoordinateX -= 3;
                    break;
                case directionEnum.UP:
                    currentDirectionFrames = this.framesUp;
                    this.newCoordinateY -= 3;
                    break;
                case directionEnum.DOWN:
                    currentDirectionFrames = this.framesDown;
                    this.newCoordinateY += 3;
                    break;
                default:
                    break;
            }
            //check collision with walls
            let collision = false;
            walls.forEach(wall => {
                if (wall.collisionCheck(this)) {
                    collision = true;
                }
            });
            //command for pacman's direction if way is free
            if (!collision) {
                this.direction = this.nextDirection;
                this.nextDirection = null;
            }
        }
        //continue moving if pacman couldn't turn(old direction)
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
        //check collision in old direction
        walls.forEach(wall => {
            if (wall.collisionCheck(this)) {
                this.direction = null;
            }
        }); 
        //if pacman didn't collide with walls (in old direction)
        if (this.direction != null) {
            this.coordinateX = this.newCoordinateX;
            this.coordinateY = this.newCoordinateY;
        }

        if (this.alive && (this.direction === null || this.direction === undefined)) {
            //if pacman collide with wall then draw default right frame
            this.framesRight[0].drawMovingElement(this.coordinateX, this.coordinateY);
            return;
        }
        //if pacman didn't collide, continue draw animation
        currentDirectionFrames[this.frameNumber].drawMovingElement(this.coordinateX, this.coordinateY);
        //check if we need to change frame number
        if (timestamp - this.frameStartTimestamp >= this.duration) {
            this.frameStartTimestamp = timestamp;
            //check if frame array is ended, then start from 0 element
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
    
    //abandon for new game
    abandonState() {
        super.abandonState();
        this.alive = true;
    }
}