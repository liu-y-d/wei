import {Node,Vec2,sys} from "cc";
import {HexagonManager} from "db://assets/Script/HexagonManager";

export type Coord= {x:number,y:number}
type TileMap = {[key:number]:Array<Node>};
export enum GameStateEnum{
    ready="ready",
    ing="ing",
    win="win",
    lose="lose"
}
export interface PlayerInfo {
    playerId:string,
    nickName:string,
    avatarUrl:string,
    gameLevel:number
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

    public defaultObstacleNum ;

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

    public setPlayerInfo(playerInfo: PlayerInfo) {
        sys.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    }
    public getPlayerInfo(): PlayerInfo {
        return JSON.parse(sys.localStorage.getItem('playerInfo'))
    }


    public playerNext() {
        let playerInfo = JSON.parse(sys.localStorage.getItem('playerInfo'))
        playerInfo.gameLevel++;
        sys.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    }
}
