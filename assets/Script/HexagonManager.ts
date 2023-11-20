import {Hexagon} from "db://assets/Script/Hexagon";
import {Vec3, Vec2} from "cc";
import {Coord, Global} from "db://assets/Script/Global";

export class HexagonManager {

    /**
     * 外接圆半径
     */
    static hexagonWidth: number;

    /**
     * 边与边垂直距离
     */
    static hexagonHeight: number;

    static outerRadius: number;

    /**
     * 0 水平方向 顶点朝上 1 竖直方向 边线朝上
     */
    static layout: number;

    static WidthCount = 9;
    static HeightCount = 9;

    static sqrt3divide2 = 0.866;

    static center:Vec2;
    static hexagonMap;

    public static calculateWidthAndHeight(totalWidth: number, layout: number) {

        if (this.layout === 0) {
            this.hexagonHeight = totalWidth / (this.WidthCount + 0.5) / 2;
            this.hexagonWidth = this.hexagonHeight / this.sqrt3divide2;
        } else {
            this.hexagonHeight = totalWidth / (this.WidthCount + 0.5) / 2;
            this.hexagonWidth = this.hexagonHeight / this.sqrt3divide2
        }
        this.outerRadius = HexagonManager.hexagonWidth - 5;

        console.log("h:", this.hexagonHeight)
        console.log("w:", this.hexagonWidth)
    }

    public static InitMap(totalWidth: number, layout: number): Array<Hexagon> {
        this.layout = layout;
        this.center = new Vec2(Math.floor(HexagonManager.WidthCount / 2) , Math.floor(HexagonManager.HeightCount / 2));
        this.calculateWidthAndHeight(totalWidth, layout);
        var result = new Array<Hexagon>();
        for (var y = 0; y < this.HeightCount; y++) {
            for (var x = 0; x < this.WidthCount; x++) {
                var hexagon = new Hexagon();
                hexagon.x = x;
                hexagon.y = y;
                result.push(hexagon);
            }
        }
        this.hexagonMap = result;
        return result;
    }

    /**
     * 获取触摸点所在正六边形的索引
     * @param px
     * @param py
     * @constructor
     */
    public static getHexagon(px, py): Vec2 {
        let y = (py - this.hexagonWidth) / (1.5 * this.hexagonWidth);
        let y1 = Math.abs(Math.floor(y));
        let y2 = Math.abs(Math.ceil(y));
        //偶数
        let x1 = Math.abs(Math.floor(px / this.hexagonHeight / 2));
        //奇数
        let x2 = Math.abs(Math.floor((px - this.hexagonHeight) / this.hexagonHeight / 2));

        let list = new Array<Vec2>();
        let index1 = new Vec2();
        if (x1 < HexagonManager.WidthCount && y1 < HexagonManager.HeightCount) {
            index1.x = x1;
            index1.y = y1;
            list.push(index1);
        }
        let index2 = new Vec2();
        if (x1 < HexagonManager.WidthCount && y2 < HexagonManager.HeightCount) {
            index2.x = x1;
            index2.y = y2;
            list.push(index2);
        }
        let index3 = new Vec2();
        if (x2 < HexagonManager.WidthCount && y1 < HexagonManager.HeightCount) {
            index3.x = x2;
            index3.y = y1;
            list.push(index3);
        }
        let index4 = new Vec2();
        if (x2 < HexagonManager.WidthCount && y2 < HexagonManager.HeightCount) {
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
    public static Distance(px, py, index: Vec2): number {
        let center = this.getCenter(index);
        return Math.sqrt((px - center.x) * (px - center.x) + (py - center.y) * (py - center.y));

    }

    /**
     * 计算正六边形中心
     *
     * @param index
     */
    public static getCenter(index: Vec2): Vec2 {
        let x, y;
        if (HexagonManager.layout == 0) {
            if ((index.y & 1) == 0) {
                x = HexagonManager.hexagonHeight * (index.x * 2 + 1);
            }
            //奇数
            else {
                x = 2 * HexagonManager.hexagonHeight * (index.x + 1);
            }
        } else {
            x = HexagonManager.hexagonWidth * (index.x * 1.5 + 1);
        }
        if (HexagonManager.layout == 0) {
            y = HexagonManager.hexagonWidth * (index.y * 1.5 + 1);
        } else {
            if ((index.x & 1) == 0) {
                y = HexagonManager.hexagonHeight * (index.y * 2 + 1);
            }
            //奇数
            else {
                y = 2 * HexagonManager.hexagonHeight * (index.y + 1);
            }
        }
        return new Vec2(x, y)
    }



    public static getNearbyHexagonCoords(point?:Coord):Array<Coord> {
        if (!point) {
            point = Global.getInstance().currentGhostVec2;
        }
        // 顶点朝上 奇数行偏移
        let nearbyHexagonCoords:Array<Coord> = new Array<Coord>();
        nearbyHexagonCoords.push(
            {x: point.x + 1, y: point.y},
            {x: point.x + (point.y&1), y: point.y - 1},
            {x: point.x - ((point.y&1)==0?1:0), y: point.y - 1},
            {x: point.x - 1, y: point.y},
            {x: point.x - ((point.y&1)==0?1:0), y: point.y + 1},
            {x: point.x +(point.y&1), y: point.y + 1}
        );
        return nearbyHexagonCoords;
    }
}