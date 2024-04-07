import {instantiate, Node, ParticleSystem2D, tween, UITransform, Vec2, Vec3} from "cc";
import {Coord, Global} from "db://assets/Script/Global";
import {ShapeEnum, ShapeFactory, ShapeManager} from "db://assets/Script/ShapeManager";
import {Shape} from "db://assets/Script/Shape";
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";
import {Draw} from "db://assets/Script/Draw";
import {PrefabController} from "db://assets/Script/PrefabController";

export class HexagonManager extends ShapeManager {


    shapeEnum: ShapeEnum = ShapeEnum.SIX;
    shapeWidth: number;
    shapeHeight: number;
    /**
     * 外接圆半径
     */
    hexagonWidth: number;

    /**
     * 边与边垂直距离
     */
    hexagonHeight: number;

    outerRadius: number;

    /**
     * 0 水平方向 顶点朝上 1 竖直方向 边线朝上
     */
    layout: number;

    WidthCount = 9;
    HeightCount = 9;

    center: Vec2;
    hexagonMap;
    directNode: Node;
    currentNearbyHexagonCoords: Array<Coord>;


    public calculateWidthAndHeight(totalWidth: number, layout: number) {

        if (this.layout === 0) {
            this.hexagonHeight = totalWidth / (this.WidthCount + 0.5) / 2;
            this.hexagonWidth = this.hexagonHeight / this.sqrt3divide2;
        } else {
            // this.hexagonHeight = totalWidth / (this.WidthCount + 0.5) / 2;
            // this.hexagonWidth = this.hexagonHeight / this.sqrt3divide2

            this.hexagonWidth = totalWidth / (Math.floor(this.WidthCount / 2) + 1 + Math.floor(this.WidthCount / 2) / 2) / 2;
            this.hexagonHeight = this.hexagonWidth * this.sqrt3divide2;
        }
        this.outerRadius = this.hexagonWidth - 5;
        if (this.layout == 0) {
            this.innerCircleRadius = this.hexagonWidth / 2;
        } else {
            this.innerCircleRadius = this.hexagonHeight / 2;
        }
        this.shapeWidth = this.hexagonWidth;
        this.shapeHeight = this.hexagonHeight;
    }

    initMap(totalWidth: number): Array<Shape> {
        this.layout = 1;
        this.center = new Vec2(Math.floor(this.WidthCount / 2), Math.floor(this.HeightCount / 2));
        this.calculateWidthAndHeight(totalWidth, this.layout);
        var result = [];
        for (var y = 0; y < this.HeightCount; y++) {
            for (var x = 0; x < this.WidthCount; x++) {

                result.push(ShapeFactory.create(x, y, this.shapeEnum));
            }
        }
        this.hexagonMap = result;
        return result;
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


        // console.log(tweens)
        // // @ts-ignore
        // obstacleTween.sequence(tweens).start();
        // console.log("asdfasd",obstacleTween)
        // obstacleTween.start();
    }

    direct(coord: Coord, duration) {
        this.directNode = Global.getInstance().playArea.getChildByName('Direct');
        let target = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x, coord.y));
        this.directNode.setSiblingIndex(9999);
        // this.directNode.getComponent(ParticleSystem2D).stopSystem();
        // this.directNode.setPosition(target.x,target.y)
        this.directNode.active = true;
        this.directNode.getComponent(ParticleSystem2D).resetSystem();
        tween(this.directNode).to(duration, {position: new Vec3(target.x, target.y, 0)}).start()
        // let animation = this.directNode.getComponent(Animation);
        // animation.pause();

    }

    propsDirect(coord: Coord, duration, position) {
        this.directNode = Global.getInstance().playArea.getChildByName('Direct');
        let target = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x, coord.y));
        this.directNode.setPosition(Global.getInstance().playArea.getComponent(UITransform).convertToNodeSpaceAR(position));
        this.directNode.setSiblingIndex(9999);
        // this.directNode.getComponent(ParticleSystem2D).stopSystem();
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

    /**
     * 获取触摸点所在正六边形的索引
     * @param px
     * @param py
     * @constructor
     */
    public getShape(px, py): Vec2 {
        let x1, x2, y1, y2;
        if (this.layout == 0) {
            let y = (py - this.hexagonWidth) / (1.5 * this.hexagonWidth);
            y1 = Math.abs(Math.floor(y));
            y2 = Math.abs(Math.ceil(y));
            //偶数
            x1 = Math.abs(Math.floor(px / this.hexagonHeight / 2));
            //奇数
            x2 = Math.abs(Math.floor((px - this.hexagonHeight) / this.hexagonHeight / 2));
        } else {
            let x = (px - this.hexagonWidth) / (1.5 * this.hexagonWidth);
            x1 = Math.abs(Math.floor(x));
            x2 = Math.abs(Math.ceil(x));
            //偶数
            y1 = Math.abs(Math.floor(py / this.hexagonHeight / 2));
            //奇数
            y2 = Math.abs(Math.floor((py - this.hexagonHeight) / this.hexagonHeight / 2));
        }


        let list = new Array<Vec2>();
        let index1 = new Vec2();
        if (x1 < this.WidthCount && y1 < this.HeightCount) {
            index1.x = x1;
            index1.y = y1;
            list.push(index1);
        }
        let index2 = new Vec2();
        if (x1 < this.WidthCount && y2 < this.HeightCount) {
            index2.x = x1;
            index2.y = y2;
            list.push(index2);
        }
        let index3 = new Vec2();
        if (x2 < this.WidthCount && y1 < this.HeightCount) {
            index3.x = x2;
            index3.y = y1;
            list.push(index3);
        }
        let index4 = new Vec2();
        if (x2 < this.WidthCount && y2 < this.HeightCount) {
            index4.x = x2;
            index4.y = y2;
            list.push(index4);
        }
        //直接结算,如果到到圆心的距离，小于H，就是它
        //大于 R 的直接扔掉
        for (let item of list) {
            if (this.Distance(px, py, item) <= this.hexagonHeight) {
                return item;
            }
        }
        //如果在 H-R 之间的
        for (let item of list) {
            if (this.Distance(px, py, item) <= this.hexagonWidth) {
                return item;
            }
        }
    }

    /**
     * 计算点到中心距离
     * @param px
     * @param py
     * @param index
     * @constructor
     */
    public Distance(px, py, index: Vec2): number {
        let center = this.getCenter(index);
        return Math.sqrt((px - center.x) * (px - center.x) + (py - center.y) * (py - center.y));

    }

    /**
     * 计算正六边形中心
     *
     * @param index
     */
    public getCenter(index: Vec2): Vec2 {
        let x, y;
        if (this.layout == 0) {
            if ((index.y & 1) == 0) {
                x = this.hexagonHeight * (index.x * 2 + 1);
            }
            //奇数
            else {
                x = 2 * this.hexagonHeight * (index.x + 1);
            }
        } else {
            x = this.hexagonWidth * (index.x * 1.5 + 1);
        }
        if (this.layout == 0) {
            y = this.hexagonWidth * (index.y * 1.5 + 1);
        } else {
            if ((index.x & 1) == 0) {
                y = this.hexagonHeight * (index.y * 2 + 1);
            }
            //奇数
            else {
                y = 2 * this.hexagonHeight * (index.y + 1);
            }
        }
        return new Vec2(x, y)
    }


    public getNearbyShapeCoords(point?: Coord): Array<Coord> {
        if (!point) {
            point = Global.getInstance().currentGhostVec2;
        }
        // 顶点朝上 奇数行偏移
        let nearbyHexagonCoords: Array<Coord> = new Array<Coord>();
        if (this.layout == 0) {
            nearbyHexagonCoords.push(
                {x: point.x + 1, y: point.y},
                {x: point.x + (point.y & 1), y: point.y + 1},
                {x: point.x - ((point.y & 1) == 0 ? 1 : 0), y: point.y + 1},
                {x: point.x - 1, y: point.y},
                {x: point.x - ((point.y & 1) == 0 ? 1 : 0), y: point.y - 1},
                {x: point.x + (point.y & 1), y: point.y - 1}
            );
        } else {
            nearbyHexagonCoords.push(
                {x: point.x + 1, y: point.y + (point.x & 1)},
                {x: point.x, y: point.y + 1},
                {x: point.x - 1, y: point.y + (point.x & 1)},
                {x: point.x - 1, y: point.y - ((point.x & 1) == 0 ? 1 : 0)},
                {x: point.x, y: point.y - 1},
                {x: point.x + 1, y: point.y - ((point.x & 1) == 0 ? 1 : 0)}
            );
        }
        if (!point) {
            this.currentNearbyHexagonCoords = nearbyHexagonCoords;
        }
        return nearbyHexagonCoords;
    }



    getPx(shape: Shape) {
        if (this.layout == 0) {
            if (shape.y % 2 == 0) {
                return this.hexagonHeight * (shape.x * 2 + 1);
            }
            //奇数
            else {
                return 2 * this.hexagonHeight * (shape.x + 1);
            }
        } else {
            return this.hexagonWidth * (shape.x * 1.5 + 1);
        }
    }

    getPy(shape: Shape) {
        if (this.layout == 0) {
            return this.hexagonWidth * (shape.y * 1.5 + 1);
        } else {
            if (shape.x % 2 == 0) {
                return this.hexagonHeight * (shape.y * 2 + 1);
            }
            //奇数
            else {
                return 2 * this.hexagonHeight * (shape.y + 1);
            }
        }

    }

    hex_corner(center, size, i,) {
        var angle_deg = 60 * i + (this.layout === 0 ? 30 : 0);
        var angle_rad = Math.PI / 180 * angle_deg
        return new Vec2(center.x + size * Math.cos(angle_rad),
            center.y + size * Math.sin(angle_rad))
    }

    draw(ctx, shape: Shape) {

        ctx.clear();
        ctx.lineWidth = 0;
        // var px=this.getPx(shape);
        // var py=this.getPy(shape);
        let center = new Vec2(0, 0);
        // var hexagonWidth=HexagonManager.hexagonWidth-7;
        // var hexagonheight=hexagonWidth * 0.866;
        //一边
        let p0 = this.hex_corner(center, this.outerRadius, 0);
        ctx.moveTo(p0.x, p0.y);

        let p1 = this.hex_corner(center, this.outerRadius, 1);

        ctx.lineTo(p1.x, p1.y);

        let p2 = this.hex_corner(center, this.outerRadius, 2);
        ctx.lineTo(p2.x, p2.y);
        let p3 = this.hex_corner(center, this.outerRadius, 3);
        ctx.lineTo(p3.x, p3.y);

        let p4 = this.hex_corner(center, this.outerRadius, 4);
        ctx.lineTo(p4.x, p4.y);

        let p5 = this.hex_corner(center, this.outerRadius, 5);
        ctx.lineTo(p5.x, p5.y);
        ctx.lineTo(p0.x, p0.y);

        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        // ctx.circle(px,py,HexagonManager.hexagonWidth);
        ctx.strokeColor.fromHEX("#ffffff");
        ctx.stroke();
        //4边
        // ctx.fillColor.fromHEX("#212529");
        ctx.fillColor.fromHEX("#3C6338");
        ctx.fill();
    }

    drawDestination(graphics, shape: Shape) {

        this.draw(graphics,shape)
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
// graphics.fill();
        // ctx.lineWidth = 15;
        // // var px=this.getPx(shape);
        // // var py=this.getPy(shape);
        // let center = new Vec2(0, 0);
        // // var hexagonWidth=HexagonManager.hexagonWidth-7;
        // // var hexagonheight=hexagonWidth * 0.866;
        // //一边
        // let p0 = this.hex_corner(center, this.outerRadius, 0);
        // ctx.moveTo(p0.x, p0.y);
        //
        // let p1 = this.hex_corner(center, this.outerRadius, 1);
        //
        // ctx.lineTo(p1.x, p1.y);
        //
        // let p2 = this.hex_corner(center, this.outerRadius, 2);
        // ctx.lineTo(p2.x, p2.y);
        // let p3 = this.hex_corner(center, this.outerRadius, 3);
        // ctx.lineTo(p3.x, p3.y);
        //
        // let p4 = this.hex_corner(center, this.outerRadius, 4);
        // ctx.lineTo(p4.x, p4.y);
        //
        // let p5 = this.hex_corner(center, this.outerRadius, 5);
        // ctx.lineTo(p5.x, p5.y);
        // ctx.lineTo(p0.x, p0.y);
        //
        // // ctx.circle(px,py,hexagonheight);
        // // ctx.strokeColor.fromHEX("#363333")
        // // ctx.circle(px,py,HexagonManager.hexagonWidth);
        // ctx.strokeColor.fromHEX("#F55F5F");
        // ctx.stroke();
        // //4边
        // // ctx.fillColor.fromHEX("#212529");
        // ctx.fillColor.fromHEX("#3C6338");
        // ctx.fill();
    }

    creatorObstacle(ctx, shape: Shape) {
        this.draw(ctx,shape);
        ctx.lineWidth = 0;
        // var px=this.getPx(shape);
        // var py=this.getPy(shape);
        // let center = new Vec2(px,py);
        //    ctx.strokeColor.fromHEX("#ff0000")
        ctx.fillColor.fromHEX("#BD9A8C")
        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        ctx.circle(0, 0, this.hexagonHeight - 10);
        ctx.stroke();
        ctx.fill();
        // this.node.getChildByName('Pianyi').getComponent(Label).string = "x:"+hexagon.x+",y:"+hexagon.y;
        // console.log("pianyi:" +"x:"+hexagon.x+",y:"+hexagon.y)
        // let cube = HexagonManager.pianyi_cube(hexagon.x,hexagon.y)
        // this.node.getChildByName('Zhou').getComponent(Label).string = "x:"+cube.x+",y:"+cube.y+",z:"+cube.z;
        // console.log("Zhou:" +"x:"+cube.x+",y:"+cube.y+",z:"+cube.z)
    }

    // initDestination() {
    //     let destinationNum = 6;
    //     LevelDesign.getInstance().currentDestination = new Array<Coord>();
    //     if (LevelDesign.getInstance().difficultyLevel == DifficultyLevelEnum.Easy) {
    //         LevelDesign.getInstance().currentDestination = this.generateRandomCoordinatesOnSides(this.WidthCount  - 1, destinationNum);
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
    //
    //     }
    // }


}
