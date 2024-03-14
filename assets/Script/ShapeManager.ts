
import {Vec3, Vec2} from "cc";
import {Coord} from "db://assets/Script/Global";
import {Shape} from "db://assets/Script/Shape";

export abstract class ShapeManager {
    abstract initMap(totalWidth: number):Array<Shape>;
    abstract getShape(px, py):Vec2;
    abstract getCenter(index: Vec2):Vec2;
    abstract getNearbyShapeCoords(point?:Coord):Array<Coord>;
    abstract isEdge(coord:Coord):boolean;
    shapeEnum:ShapeEnum;
    shapeWidth:number;
    shapeHeight:number;
    WidthCount:number;
    HeightCount:number;
    center:Vec2;
    sqrt3divide2 = 0.866;
    innerCircleRadius:number;
    directNode:Node;
    abstract getPy(shape: Shape);
    abstract getPx(shape: Shape);

    abstract direct(coord: Coord,duration);
    abstract closeDirect();

    abstract draw(ctx,shape: Shape);
    abstract creatorObstacle(ctx,shape: Shape);
    abstract createDefaultObstacle();
}
// export interface Shape {
//     x: number;
//     y:number;
//     shape:ShapeEnum;
//     getPx():number;
//     getPy():number;
// }
export enum ShapeEnum {
    FOUR,SIX
}
export class ShapeFactory{
    static create(x,y,shape:ShapeEnum){
        var s = new Shape(x,y);
        s.shape = shape;
        return s;
        // switch (shape) {
        //     case ShapeEnum.THREE:
        //         break;
        //     case ShapeEnum.FOUR:
        //         break;
        //     case ShapeEnum.FIVE:
        //         break;
        //     case ShapeEnum.SIX:
        //
        //         return s;
        // }
    }
}