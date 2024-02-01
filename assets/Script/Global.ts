import {Node,Vec2} from "cc";
import {HexagonManager} from "db://assets/Script/HexagonManager";

export type Coord= {x:number,y:number}
type TileMap = {[key:number]:Array<Node>};
export enum GameStateEnum{
    ready="ready",
    ing="ing",
    win="win",
    lose="lose"
}
export class Global {
    private static _instance: Global;
    public static getInstance(): Global {
        if (!this._instance) {
            this._instance = new Global();
        }
        return this._instance;

    }
    gameState:GameStateEnum = GameStateEnum.ready;
    public gameCanvas;

    public playArea:Node;

    public tileMap:TileMap = {};

    public defaultObstacleNum = 15;

    public obstacleCoords:Array<Coord>;

    public predictCoord:Coord;
    /**
     * 当前移动坐标
     */
    public currentGhostVec2:Vec2;
    /**
     * 上一个位置的坐标
     */
    public prevGhostVec2:Vec2;

    public ghostMoving:boolean;
    //
    // public nearbyHexagonCoords:Coord[] = [];




}
