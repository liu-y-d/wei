import {Vec3, Vec2, Node} from "cc";
import {Coord} from "db://assets/Script/Global";
import {Shape} from "db://assets/Script/Shape";

export type side = { type: string, xRange?: [], y?: number, x?: number, yRange?: [], usedPoints: Set<Coord> }

export abstract class ShapeManager {
	abstract initMap(totalWidth: number): Array<Shape>;

	abstract getShape(px, py): Vec2;

	abstract getCenter(index: Vec2): Vec2;

	abstract getNearbyShapeCoords(point?: Coord): Array<Coord>;

	abstract isEdge(coord: Coord): boolean;

	shapeEnum: ShapeEnum;
	shapeWidth: number;
	shapeHeight: number;
	WidthCount: number;
	HeightCount: number;
	center: Vec2;
	sqrt3divide2 = 0.866;
	innerCircleRadius: number;
	directNode: Node;

	abstract getPy(shape: Shape);

	abstract getPx(shape: Shape);

	abstract direct(coord: Coord, duration);

	abstract propsDirect(coord: Coord, duration, position: Vec3);

	abstract closeDirect();

	abstract draw(ctx, shape: Shape);

	abstract drawDestination(ctx, shape: Shape);

	abstract creatorObstacle(ctx, shape: Shape);

	abstract createDefaultObstacle();

	abstract initDestination();

	generateRandomCoordinatesOnSides(length, n) {
        const edgePoints = new Array<Coord>();
        const edgePointsFinal = new Array<Coord>();


        // 上边（包含左上和右上角点）
        for (let x = 0; x <= length; x++) {
            edgePoints.push({x:x, y:0});
        }

        // 右边（包含右上和右下角点）
        for (let y = 1; y <= length; y++) {
            edgePoints.push({x:length, y:y});
        }

        // 下边（包含右下和左下角点）
        for (let x = length - 1; x >= 0; x--) {
            edgePoints.push({x:x, y:length});
        }

        // 左边（包含左下和左上角点）
        for (let y = length - 1; y >= 0; y--) {
            edgePoints.push({x:0, y:y});
        }
        function generateUniqueRandoms(n, M) {
            if (n > M + 1) {
                throw new Error('Cannot generate more unique numbers than the range');
            }

            let numbers = Array.from({length: M + 1}, (_, i) => i); // 创建包含0到M的数组
            let result = [];

            while (numbers.length > 0 && result.length < n) {
                let randomIndex = Math.floor(Math.random() * numbers.length);
                result.push(numbers[randomIndex]);
                numbers.splice(randomIndex, 1); // 移除已选择的元素
            }

            return result;
        }
        let indexArray = generateUniqueRandoms(n,edgePoints.length - 1)
        for (let indexArrayElement of indexArray) {
            edgePointsFinal.push(edgePoints[indexArrayElement]);
        }
        return edgePointsFinal;

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
	FOUR, SIX
}

export class ShapeFactory {
	static create(x, y, shape: ShapeEnum) {
		var s = new Shape(x, y);
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
