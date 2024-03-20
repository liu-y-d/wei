
import {Vec3, Vec2,Node} from "cc";
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
    abstract propsDirect(coord: Coord,duration,position:Vec3);
    abstract closeDirect();

    abstract draw(ctx,shape: Shape);
    abstract drawDestination(ctx,shape: Shape);
    abstract creatorObstacle(ctx,shape: Shape);
    abstract createDefaultObstacle();

    abstract initDestination();

    generateRandomCoordinatesOnSides(length,n) {
        // 验证输入值
        if (!Number.isInteger(n) || n <= 0) {
            throw new Error("Invalid input. The number of points should be a positive integer.");
        }

        const sides = [
            { type: 'horizontal', xRange: [0, length], y: 0, usedPoints: new Set() },
            { type: 'vertical', x: length, yRange: [0, length], usedPoints: new Set() },
            { type: 'horizontal', xRange: [length, 0], y: length, usedPoints: new Set() },
            { type: 'vertical', x: 0, yRange: [length, 0], usedPoints: new Set() }
        ];

        let randomPoints = [];
        let generatedCount = 0;

        while (generatedCount < n) {
            for (const side of sides) {
                if (side.usedPoints.size < Math.min(side.type === 'horizontal' ? length : length + 1, n - generatedCount)) {
                    let candidate;
                    if (side.type === 'horizontal') {
                        candidate = { x: Math.floor(Math.random() * (side.xRange[1] - side.xRange[0] + 1)) + side.xRange[0], y: side.y };
                    } else {
                        candidate = { x: side.x, y: Math.floor(Math.random() * (side.yRange[1] - side.yRange[0] + 1)) + side.yRange[0] };
                    }

                    if (!side.usedPoints.has(JSON.stringify(candidate))) {
                        side.usedPoints.add(JSON.stringify(candidate));
                        randomPoints.push(JSON.parse(JSON.stringify(candidate)));
                        generatedCount++;
                        if (generatedCount === n) {
                            break;
                        }
                    }
                }
            }
        }

        return randomPoints;
    }

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