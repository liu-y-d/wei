import {Vec2,ParticleSystem2D,tween,Vec3} from "cc";
import {Coord, Global} from "db://assets/Script/Global";
import {ShapeEnum, ShapeFactory, ShapeManager} from "db://assets/Script/ShapeManager";
import {Shape} from "db://assets/Script/Shape";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Draw} from "db://assets/Script/Draw";
import {Block} from "db://assets/Script/NearestSolver";

export class HexagonManager extends ShapeManager{


    shapeEnum:ShapeEnum = ShapeEnum.SIX;
    shapeWidth:number;
    shapeHeight:number;
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

    center:Vec2;
    hexagonMap;
    directNode;
    currentNearbyHexagonCoords:Array<Coord>;


    public calculateWidthAndHeight(totalWidth: number, layout: number) {

        if (this.layout === 0) {
            this.hexagonHeight = totalWidth / (this.WidthCount + 0.5) / 2;
            this.hexagonWidth = this.hexagonHeight / this.sqrt3divide2;
        } else {
            // this.hexagonHeight = totalWidth / (this.WidthCount + 0.5) / 2;
            // this.hexagonWidth = this.hexagonHeight / this.sqrt3divide2

            this.hexagonWidth = totalWidth / (Math.floor(this.WidthCount / 2) + 1 + Math.floor(this.WidthCount / 2) / 2)/2;
            this.hexagonHeight = this.hexagonWidth * this.sqrt3divide2;
        }
        this.outerRadius = this.hexagonWidth - 5;
        if (this.layout == 0) {
            this.innerCircleRadius = this.hexagonWidth/2;
        }else {
            this.innerCircleRadius = this.hexagonHeight/2;
        }
        this.shapeWidth = this.hexagonWidth;
        this.shapeHeight = this.hexagonHeight;
    }

     initMap(totalWidth: number): Array<Shape> {
        this.layout = 1;
        this.center = new Vec2(Math.floor(this.WidthCount / 2) , Math.floor(this.HeightCount / 2));
        this.calculateWidthAndHeight(totalWidth, this.layout);
        var result = [];
        for (var y = 0; y < this.HeightCount; y++) {
            for (var x = 0; x < this.WidthCount; x++) {

                result.push( ShapeFactory.create(x,y,this.shapeEnum));
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
        while(count < Global.getInstance().defaultObstacleNum) {
            let x = Math.floor(Math.random() * (LevelDesign.getInstance().getShapeManager().WidthCount))
            let y = Math.floor(Math.random() * (LevelDesign.getInstance().getShapeManager().HeightCount))
            let tile = Global.getInstance().tileMap[x][y].getComponent(Draw);
            if ((x == LevelDesign.getInstance().getShapeManager().center.x && y == LevelDesign.getInstance().getShapeManager().center.y)
                || (x == Global.getInstance().predictCoord.x && y == Global.getInstance().predictCoord.y)
                || tile.hasObstacle) {
                continue;
            }
            tile.creatorObstacle();
            Global.getInstance().obstacleCoords.push({x,y})
            count++;
        }
    }
    direct(coord: Coord,duration) {
        this.directNode = Global.getInstance().playArea.getChildByName('Direct');
        let target = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x,coord.y));
        this.directNode.setSiblingIndex(9999);
        // this.directNode.getComponent(ParticleSystem2D).stopSystem();
        // this.directNode.setPosition(target.x,target.y)
        this.directNode.active = true;
        this.directNode.getComponent(ParticleSystem2D).resetSystem();
        tween(this.directNode).to(duration,{position:new Vec3(target.x,target.y,0)}).start()
        // let animation = this.directNode.getComponent(Animation);
        // animation.pause();

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
        let x1,x2,y1,y2;
        if (this.layout == 0) {
            let y = (py - this.hexagonWidth) / (1.5 * this.hexagonWidth);
            y1 = Math.abs(Math.floor(y));
            y2 = Math.abs(Math.ceil(y));
            //偶数
            x1 = Math.abs(Math.floor(px / this.hexagonHeight / 2));
            //奇数
            x2 = Math.abs(Math.floor((px - this.hexagonHeight) / this.hexagonHeight / 2));
        }else {
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



    public getNearbyShapeCoords(point?:Coord):Array<Coord> {
        if (!point) {
            point = Global.getInstance().currentGhostVec2;
        }
        // 顶点朝上 奇数行偏移
        let nearbyHexagonCoords:Array<Coord> = new Array<Coord>();
        if (this.layout == 0) {
            nearbyHexagonCoords.push(
                {x: point.x + 1, y: point.y},
                {x: point.x + (point.y&1), y: point.y + 1},
                {x: point.x - ((point.y&1)==0?1:0), y: point.y + 1},
                {x: point.x - 1, y: point.y},
                {x: point.x - ((point.y&1)==0?1:0), y: point.y - 1},
                {x: point.x +(point.y&1), y: point.y - 1}
            );
        }else {
            nearbyHexagonCoords.push(
                {x: point.x + 1, y: point.y + (point.x&1)},
                {x: point.x , y: point.y + 1},
                {x: point.x - 1 , y: point.y + (point.x&1)},
                {x: point.x - 1, y: point.y - ((point.x&1)==0?1:0)},
                {x: point.x , y: point.y - 1},
                {x: point.x + 1, y: point.y - ((point.x&1)==0?1:0)}
            );
        }
        if (!point) {
            this.currentNearbyHexagonCoords = nearbyHexagonCoords;
        }
        return nearbyHexagonCoords;
    }

    public isEdge(coord:Coord){
        return (coord.x ==0 && coord.y < this.HeightCount) ||
            (coord.x < this.WidthCount && coord.y ==0) ||
            (coord.x ==this.WidthCount-1 && coord.y < this.HeightCount) ||
            (coord.x < this.WidthCount && coord.y ==this.HeightCount-1);
        
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
    hex_corner(center, size, i, ) {
        var angle_deg = 60 * i + (this.layout ===0?30:0);
        var angle_rad = Math.PI / 180 * angle_deg
        return new Vec2 (center.x + size * Math.cos(angle_rad),
            center.y + size * Math.sin(angle_rad))
    }
    draw(ctx, shape: Shape) {

        ctx.clear();
        ctx.lineWidth = 0;
        // var px=this.getPx(shape);
        // var py=this.getPy(shape);
        let center = new Vec2(0,0);
        // var hexagonWidth=HexagonManager.hexagonWidth-7;
        // var hexagonheight=hexagonWidth * 0.866;
        //一边
        let p0 = this.hex_corner(center,this.outerRadius,0);
        ctx.moveTo(p0.x, p0.y);

        let p1 = this.hex_corner(center,this.outerRadius,1);

        ctx.lineTo(p1.x, p1.y);

        let p2 = this.hex_corner(center,this.outerRadius,2);
        ctx.lineTo(p2.x, p2.y);
        let p3 = this.hex_corner(center,this.outerRadius,3);
        ctx.lineTo(p3.x, p3.y);

        let p4 = this.hex_corner(center,this.outerRadius,4);
        ctx.lineTo(p4.x, p4.y);

        let p5 = this.hex_corner(center,this.outerRadius,5);
        ctx.lineTo(p5.x, p5.y);
        ctx.lineTo(p0.x,p0.y );

        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        // ctx.circle(px,py,HexagonManager.hexagonWidth);
        ctx.stroke();
        //4边
        ctx.fillColor.fromHEX("#BD9A8C");
        ctx.fill();
    }

    creatorObstacle(ctx, shape: Shape) {
        ctx.lineWidth = 0;
        // var px=this.getPx(shape);
        // var py=this.getPy(shape);
        // let center = new Vec2(px,py);
        //    ctx.strokeColor.fromHEX("#ff0000")
        ctx.fillColor.fromHEX("#E09E50")
        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        ctx.circle(0,0,this.hexagonHeight-10);
        ctx.stroke();
        ctx.fill();
        // this.node.getChildByName('Pianyi').getComponent(Label).string = "x:"+hexagon.x+",y:"+hexagon.y;
        // console.log("pianyi:" +"x:"+hexagon.x+",y:"+hexagon.y)
        // let cube = HexagonManager.pianyi_cube(hexagon.x,hexagon.y)
        // this.node.getChildByName('Zhou').getComponent(Label).string = "x:"+cube.x+",y:"+cube.y+",z:"+cube.z;
        // console.log("Zhou:" +"x:"+cube.x+",y:"+cube.y+",z:"+cube.z)
    }

}