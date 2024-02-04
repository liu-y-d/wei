import {ShapeEnum, ShapeFactory, ShapeManager} from "db://assets/Script/ShapeManager";
import {Shape} from "db://assets/Script/Shape";
import {Coord, Global} from "db://assets/Script/Global";
import {Vec2} from "cc";
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";

export class SquareManager extends ShapeManager{
    shapeEnum:ShapeEnum = ShapeEnum.FOUR;
    shapeWidth:number;
    shapeHeight:number;
    WidthCount:number = 9;
    HeightCount:number = 9;
    center:Vec2;
    outerRadius:number;
    directNode;
    creatorObstacle(ctx, shape: Shape) {
        // console.log(shape)
        ctx.lineWidth = 0;
        var px=this.getPx(shape);
        var py=this.getPy(shape);
        let center = new Vec2(px,py);
        //    ctx.strokeColor.fromHEX("#ff0000")
        ctx.fillColor.fromHEX("#E09E50")
        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        ctx.circle(px,py,this.shapeWidth/2 - 10);
        ctx.stroke();
        ctx.fill();
    }
    direct(coord: Coord) {
        this.directNode = Global.getInstance().playArea.getChildByName('Direct');
        let target = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x,coord.y));
        this.directNode.active = true;
        // let animation = this.directNode.getComponent(Animation);
        // animation.pause();
        this.directNode.setSiblingIndex(9999);
        this.directNode.setPosition(target.x,target.y)
    }
    closeDirect() {
        this.directNode.active = false;
    }
    draw(ctx, shape: Shape) {
        ctx.clear();
        ctx.lineWidth = 0;
        var px=this.getPx(shape);
        var py=this.getPy(shape);
        let center = new Vec2(px,py);
        let halfWidth = this.shapeWidth;
        ctx.roundRect(center.x - this.shapeWidth/2 + 5, center.y - this.shapeWidth/2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
        ctx.stroke();
        ctx.fillColor.fromHEX("#8CBDB9");
        ctx.fill();
    }

    getCenter(index) {
        let x,y;
        x = (index.x + 0.5) * this.shapeWidth;
        y = (index.y + 0.5) * this.shapeHeight + 60;
        return new Vec2(x,y);
    }

    getNearbyShapeCoords(point?: Coord): Array<Coord> {
        if (!point) {
            point = Global.getInstance().currentGhostVec2;
        }

        let nearbySquareCoords:Array<Coord> = new Array<Coord>();
        if (LevelDesign.getInstance().difficultyLevel == DifficultyLevelEnum.Hard) {
            nearbySquareCoords.push(
                {x: point.x, y: point.y + 1},
                {x: point.x + 1, y: point.y+1},
                {x: point.x + 1, y: point.y},
                {x: point.x + 1, y: point.y - 1},
                {x: point.x, y: point.y - 1},
                {x: point.x - 1, y: point.y -1},
                {x: point.x - 1, y: point.y},
                {x: point.x - 1, y: point.y + 1},
            );
        }else {
            nearbySquareCoords.push(
                {x: point.x, y: point.y + 1},
                {x: point.x + 1, y: point.y},
                {x: point.x, y: point.y - 1},
                {x: point.x - 1, y: point.y},
            );
        }



        return nearbySquareCoords;
    }

    getPx(shape: Shape) {
        return (shape.x + 0.5) * this.shapeWidth;
    }

    getPy(shape: Shape) {
        return (shape.y + 0.5) * this.shapeHeight + 60;
    }

    getShape(px, py) {
        py -= 60;
        if (px < 0) {
            return null;
        }
        // console.log(px)
        // console.log(py)
        return new Vec2(Math.floor(px / this.shapeWidth),Math.floor(py / this.shapeHeight));
    }
    calculateWidthAndHeight(totalWidth: number) {
        this.shapeWidth = Math.floor(totalWidth / this.WidthCount);
        this.shapeHeight = this.shapeWidth;
        this.innerCircleRadius = this.shapeWidth/2;
    }
    initMap(totalWidth: number): Array<Shape> {
        this.calculateWidthAndHeight(totalWidth);
        this.center = new Vec2(Math.floor(this.WidthCount / 2) , Math.floor(this.HeightCount / 2));
        var result = [];
        for (var y = 0; y < this.HeightCount; y++) {
            for (var x = 0; x < this.WidthCount; x++) {
                result.push( ShapeFactory.create(x,y,this.shapeEnum));
            }
        }
        return result;
    }

    isEdge(coord: Coord): boolean {
        return (coord.x ==0 && coord.y < this.HeightCount) ||
            (coord.x < this.WidthCount && coord.y ==0) ||
            (coord.x ==this.WidthCount-1 && coord.y < this.HeightCount) ||
            (coord.x < this.WidthCount && coord.y ==this.HeightCount-1);
    }

}