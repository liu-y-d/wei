import {ShapeEnum, ShapeFactory, ShapeManager} from "db://assets/Script/ShapeManager";
import {Shape} from "db://assets/Script/Shape";
import {Coord, Global} from "db://assets/Script/Global";
import {Node, Vec2, ParticleSystem2D, tween, Vec3, Graphics, instantiate, UITransform} from "cc";
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";
import {Draw} from "db://assets/Script/Draw";
import {PrefabController} from "db://assets/Script/PrefabController";

export class SquareManager extends ShapeManager {


    shapeEnum: ShapeEnum = ShapeEnum.FOUR;
    shapeWidth: number;
    shapeHeight: number;
    WidthCount: number = 9;
    HeightCount: number = 9;
    center: Vec2;
    outerRadius: number;
    directNode: Node;

    creatorObstacle(ctx, shape: Shape) {
        ctx.lineWidth = 0;
        // var px=this.getPx(shape);
        // var py=this.getPy(shape);
        // let center = new Vec2(px,py);
        //    ctx.strokeColor.fromHEX("#ff0000")
        ctx.fillColor.fromHEX("#E09E50")
        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        ctx.circle(0, 0, this.shapeWidth / 2 - 10);
        ctx.stroke();
        ctx.fill();
    }

    createDefaultObstacle() {
        Global.getInstance().obstacleCoords = new Array<Coord>();
        for (let x in Global.getInstance().tileMap) {
            if (Global.getInstance().tileMap[x] != null) {
                for (let i = 0; i < Global.getInstance().tileMap[x].length; i++) {
                    Global.getInstance().tileMap[x][i].getComponent(Draw).clearObstacle({
                        x: Number(x),
                        y: i,
                        shape: LevelDesign.getInstance().currentShapeEnum
                    })
                }
            }
        }
        let count = 0;
        let prefabCtl = Global.getInstance().gameCanvas.getComponent(PrefabController);
        let playArea = Global.getInstance().playArea;
        while (count < Global.getInstance().defaultObstacleNum) {
            let x = Math.floor(Math.random() * (LevelDesign.getInstance().getShapeManager().WidthCount))
            let y = Math.floor(Math.random() * (LevelDesign.getInstance().getShapeManager().HeightCount))
            let tileNode = Global.getInstance().tileMap[x][y];
            let tile = tileNode.getComponent(Draw);
            if ((x == LevelDesign.getInstance().getShapeManager().center.x && y == LevelDesign.getInstance().getShapeManager().center.y)
                || (x == Global.getInstance().predictCoord.x && y == Global.getInstance().predictCoord.y)
                || tile.hasObstacle) {
                continue;
            }
            let movableDirection = Global.getInstance().panelInfo.getChildByName("MovableDirection");
            let emitPosition = movableDirection.getComponent(UITransform).convertToWorldSpaceAR(movableDirection.getPosition());
            emitPosition.x = emitPosition.x - 270;
            let emit = instantiate(prefabCtl.obstacleEmit);
            playArea.addChild(emit);
            console.log(emitPosition)
            // tile.getComponent(Draw).emit = emit;
            // emit.setSiblingIndex(999999999);
            let position = playArea.getComponent(UITransform).convertToNodeSpaceAR(emitPosition)
            // let position = emit.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(0,0,0))
            emit.setPosition(new Vec3(position.x, position.y, 0))
            Global.getInstance().moveLock.active = true;

            tween(emit).delay(0.2).to(1, {position: new Vec3(tileNode.getPosition().x, tileNode.getPosition().y, 0)}).call(() => {
                tween(tile.node)
                    .to(0.1,{angle: -20})
                    .to(0.1,{angle:20})
                    .to(0.1,{angle:0})
                    .call(() => {
                        tile.creatorObstacleHasAnimation();
                        emit.destroy();
                    }).start()

            }).start();
            Global.getInstance().obstacleCoords.push({x, y})
            count++;
        }
    }

    direct(coord: Coord, duration) {
        this.directNode = Global.getInstance().playArea.getChildByName('Direct');
        let target = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x, coord.y));
        this.directNode.setSiblingIndex(9999);
        this.directNode.getComponent(ParticleSystem2D).stopSystem();
        // this.directNode.setPosition(target.x,target.y)
        this.directNode.active = true;
        this.directNode.getComponent(ParticleSystem2D).resetSystem();
        tween(this.directNode).to(duration, {position: new Vec3(target.x, target.y, 0)}).start()
        // this.directNode.active = true;
        // let animation = this.directNode.getComponent(Animation);
        // animation.pause();

    }

    propsDirect(coord: Coord, duration: any, position: Vec3) {
        this.directNode = Global.getInstance().playArea.getChildByName('Direct');

        this.directNode.setPosition(Global.getInstance().playArea.getComponent(UITransform).convertToNodeSpaceAR(position));
        let target = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x, coord.y));
        this.directNode.setSiblingIndex(9999);
        this.directNode.getComponent(ParticleSystem2D).stopSystem();
        // this.directNode.setPosition(target.x,target.y)
        this.directNode.active = true;
        this.directNode.getComponent(ParticleSystem2D).resetSystem();
        tween(this.directNode).to(duration, {position: new Vec3(target.x, target.y, 0)}).start()
    }

    closeDirect() {
        if (this.directNode) {
            this.directNode.getComponent(ParticleSystem2D).stopSystem();
            // this.directNode.active = false;
        }
    }

    draw(ctx: Graphics, shape: Shape) {
        ctx.clear();
        ctx.lineWidth = 2;
        var px = this.getPx(shape);
        var py = this.getPy(shape);
        let center = new Vec2(px, py);
        let halfWidth = this.shapeWidth;
        // ctx.roundRect(center.x - this.shapeWidth/2 + 5, center.y - this.shapeWidth/2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
        ctx.roundRect(-this.shapeWidth / 2 + 5, -this.shapeWidth / 2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
        // ctx.getParent().getPosition()
        // ctx.roundRect(ctx.getParent().getPosition().x, ctx.getParent().getPosition().y, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
        ctx.strokeColor.fromHEX("#ffffff");
        ctx.stroke();
        ctx.fillColor.fromHEX("#8CBDB9");
        ctx.fill();
    }

    getCenter(index) {
        let x, y;
        x = (index.x + 0.5) * this.shapeWidth;
        y = (index.y + 0.5) * this.shapeHeight + 60;
        return new Vec2(x, y);
    }

    getNearbyShapeCoords(point?: Coord): Array<Coord> {
        if (!point) {
            point = Global.getInstance().currentGhostVec2;
        }

        let nearbySquareCoords: Array<Coord> = new Array<Coord>();
        if (LevelDesign.getInstance().difficultyLevel == DifficultyLevelEnum.Hard) {
            nearbySquareCoords.push(
                {x: point.x, y: point.y + 1},
                {x: point.x + 1, y: point.y + 1},
                {x: point.x + 1, y: point.y},
                {x: point.x + 1, y: point.y - 1},
                {x: point.x, y: point.y - 1},
                {x: point.x - 1, y: point.y - 1},
                {x: point.x - 1, y: point.y},
                {x: point.x - 1, y: point.y + 1},
            );
        } else {
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
        return new Vec2(Math.floor(px / this.shapeWidth), Math.floor(py / this.shapeHeight));
    }

    calculateWidthAndHeight(totalWidth: number) {
        this.shapeWidth = Math.floor(totalWidth / this.WidthCount);
        this.shapeHeight = this.shapeWidth;
        this.innerCircleRadius = this.shapeWidth / 2;
    }

    initMap(totalWidth: number): Array<Shape> {
        this.calculateWidthAndHeight(totalWidth);
        this.center = new Vec2(Math.floor(this.WidthCount / 2), Math.floor(this.HeightCount / 2));
        var result = [];
        for (var y = 0; y < this.HeightCount; y++) {
            for (var x = 0; x < this.WidthCount; x++) {
                result.push(ShapeFactory.create(x, y, this.shapeEnum));
            }
        }
        return result;
    }

    isEdge(coord: Coord): boolean {
        return (coord.x == 0 && coord.y < this.HeightCount) ||
            (coord.x < this.WidthCount && coord.y == 0) ||
            (coord.x == this.WidthCount - 1 && coord.y < this.HeightCount) ||
            (coord.x < this.WidthCount && coord.y == this.HeightCount - 1);
    }


}