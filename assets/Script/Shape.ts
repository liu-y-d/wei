import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Vec3,Vec2} from "cc";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ShapeEnum} from "db://assets/Script/ShapeManager";
export class Shape {

    public x: number;
    public y: number;
    public shape:ShapeEnum;

    constructor(x:number,y:number) {
        this.x =x;
        this.y =y;
    }

}