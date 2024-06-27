import {ShapeEnum, ShapeFactory, ShapeManager} from "db://assets/Script/ShapeManager";
import {Shape} from "db://assets/Script/Shape";
import {Coord, Global} from "db://assets/Script/Global";
import {Graphics, instantiate, Node, ParticleSystem2D, tween, UITransform, Vec2, Vec3} from "cc";
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
        this.drawBottom(ctx,shape);
        let tile = Global.getInstance().tileMap[shape.x][shape.y];

        let obstacle = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).obstacle);
        obstacle.getComponent(UITransform).setContentSize(this.shapeWidth-10,(this.shapeWidth-10))
        tile.addChild(obstacle)
    }
    // creatorObstacle(ctx, shape: Shape) {
    //     this.drawBottom(ctx,shape);
    //     ctx.lineWidth = 0;
    //     // var px=this.getPx(shape);
    //     // var py=this.getPy(shape);
    //     // let center = new Vec2(px,py);
    //     //    ctx.strokeColor.fromHEX("#ff0000")
    //     ctx.fillColor.fromHEX("#E09E50")
    //     // ctx.circle(px,py,hexagonheight);
    //     // ctx.strokeColor.fromHEX("#363333")
    //     ctx.circle(0, 0, this.shapeWidth / 2 - 10);
    //     ctx.stroke();
    //     ctx.fill();
    // }

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
            // let movableDirection = Global.getInstance().panelInfo.getChildByName("MovableDirection");
            let detail = Global.getInstance().gameCanvas.getChildByName("Content").getChildByName("DetailPanel").getChildByName("Detail")
            let emitPosition = detail.getComponent(UITransform).convertToWorldSpaceAR(detail.getPosition());
            emitPosition.y = emitPosition.y - detail.getPosition().y-detail.getComponent(UITransform).height/2;
            let emit = instantiate(prefabCtl.obstacleEmit);
            playArea.addChild(emit);
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
        tween(this.directNode).to(duration, {position: new Vec3(target.x, target.y + 10, 0)}).start()
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
        tween(this.directNode).to(duration, {position: new Vec3(target.x, target.y + 10, 0)}).start()
    }

    closeDirect() {
        if (this.directNode) {
            this.directNode.getComponent(ParticleSystem2D).stopSystem();
            // this.directNode.active = false;
        }
    }

    draw(ctx: Graphics, shape: Shape) {
        ctx.clear();
        ctx.lineWidth = 0;
        if (LevelDesign.getInstance().currentMovableDirection == 8) {
            this.drawEight(ctx,0,0,"#435343");
            this.drawEight(ctx,0,10,"#a4c49f");
        }else {
            let halfWidth = this.shapeWidth;
            // ctx.roundRect(center.x - this.shapeWidth/2 + 5, center.y - this.shapeWidth/2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            ctx.roundRect(-this.shapeWidth / 2 + 5, -this.shapeWidth / 2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            // ctx.getParent().getPosition()
            // ctx.roundRect(ctx.getParent().getPosition().x, ctx.getParent().getPosition().y, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            ctx.strokeColor.fromHEX("#ffffff");
            ctx.stroke();
            ctx.fillColor.fromHEX("#435343");
            ctx.fill();

            ctx.roundRect(-this.shapeWidth / 2 + 5, -this.shapeWidth / 2 + 5 + 10, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            // ctx.getParent().getPosition()
            // ctx.roundRect(ctx.getParent().getPosition().x, ctx.getParent().getPosition().y, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            ctx.strokeColor.fromHEX("#ffffff");
            ctx.stroke();
            ctx.fillColor.fromHEX("#a4c49f");
            ctx.fill();
        }

    }
    drawBottom(ctx: any, shape: Shape) {
        ctx.clear();
        ctx.lineWidth = 0;
        if (LevelDesign.getInstance().currentMovableDirection == 8) {
            this.drawEight(ctx,0,0,"#435343");
        }else {
            let halfWidth = this.shapeWidth;
            // ctx.roundRect(center.x - this.shapeWidth/2 + 5, center.y - this.shapeWidth/2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            ctx.roundRect(-this.shapeWidth / 2 + 5, -this.shapeWidth / 2 + 5, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            // ctx.getParent().getPosition()
            // ctx.roundRect(ctx.getParent().getPosition().x, ctx.getParent().getPosition().y, halfWidth - 10, halfWidth - 10, 5); // 圆角半径为20
            ctx.strokeColor.fromHEX("#ffffff");
            ctx.stroke();
            ctx.fillColor.fromHEX("#435343");
            ctx.fill();
        }

    }

    drawEight(ctx,x,y,hex) {
        let distanceToEdge = this.shapeWidth/2; // 这里替换为你的 x 值
        // let sideLength = 2 * distanceToEdge / Math.sqrt(2); // 计算正八边形的边长
        const startingAngle = -Math.PI / 2/2/2;

        // 从第四个顶点开始遍历所有顶点
        for (let i = 0; i < 8; ++i) {
            let actualIndex = (i + 4) % 8; // 确保循环回到第一个顶点
            let angle = startingAngle + actualIndex * Math.PI / 4;

            let px = x + distanceToEdge * Math.cos(angle);
            let py = y + distanceToEdge * Math.sin(angle);

            if (i === 0) { // 第一个点
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.strokeColor.fromHEX("#ffffff");
        ctx.stroke();
        ctx.fillColor.fromHEX(hex);
        ctx.fill();


    }
    drawDestination(graphics: Graphics, shape: Shape) {
        this.drawBottom(graphics,shape)
        // 设置五角星的中心点、外接圆半径和内切圆半径（可选）
        const centerX = 0; // 假设中心点在(0, 0)
        const centerY = 0;
        const outerRadius = 30; // 外接圆半径
        const innerRadius = outerRadius * 0.61; // 内切圆半径，可以根据实际需求调整

        // 计算每个顶点的角度和坐标
        for (let i = 0; i < 5; i++) {
            let angle = i * Math.PI / 2.5 - 50; // 每隔72度一个顶点
            let x = centerX + Math.cos(angle) * outerRadius;
            let y = centerY + Math.sin(angle) * outerRadius;

            if (i === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }

            // 绘制内切五角星的线条（如果需要）
            angle += Math.PI / 5; // 内部顶点角度略作调整
            let xInner = centerX + Math.cos(angle) * innerRadius;
            let yInner = centerY + Math.sin(angle) * innerRadius;
            graphics.lineTo(xInner, yInner);
        }

        // 绘制边框（即描边）
        graphics.stroke();
        graphics.fillColor.fromHEX("#FFFF00");
        graphics.fill();
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



    // initDestination() {
    //     let destinationNum = 6;
    //     LevelDesign.getInstance().currentDestination = new Array<Coord>();
    //     if (LevelDesign.getInstance().difficultyLevel == DifficultyLevelEnum.Easy) {
    //         destinationNum = destinationNum*2;
    //         LevelDesign.getInstance().currentDestination = this.generateRandomCoordinatesOnSides(this.WidthCount - 1, destinationNum);
    //     }else if (LevelDesign.getInstance().difficultyLevel == DifficultyLevelEnum.Medium) {
    //         destinationNum = destinationNum*2;
    //         LevelDesign.getInstance().currentDestination = this.generateRandomCoordinatesOnSides(this.WidthCount - 1, destinationNum);
    //     }else {
    //         destinationNum = destinationNum*3;
    //         LevelDesign.getInstance().currentDestination = this.generateRandomCoordinatesOnSides(this.WidthCount - 1, destinationNum);
    //         // 四边满
    //         // for (let i = 0; i < this.WidthCount; i++) {
    //         //     LevelDesign.getInstance().currentDestination.push({x:0,y:i})
    //         //     LevelDesign.getInstance().currentDestination.push({x:i,y:0})
    //         //     LevelDesign.getInstance().currentDestination.push({x:i,y:this.WidthCount -1})
    //         //     LevelDesign.getInstance().currentDestination.push({x:this.WidthCount -1,y:i})
    //         // }
    //         // LevelDesign.getInstance().currentDestination = LevelDesign.getInstance().currentDestination.reduce((pre, cur) => {
    //         //     var exists = pre.find(item => JSON.stringify(item) === JSON.stringify(cur));
    //         //     if (!exists) {
    //         //         pre.push(cur);
    //         //     }
    //         //     return pre;
    //         // }, []);
    //     }
    // }
}
