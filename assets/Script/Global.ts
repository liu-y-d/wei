import {Node,Vec2,sys} from "cc";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";

export type Coord= {x:number,y:number}
export type resume = (instance: BaseProps)=>void
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
export interface PropsConfig {
    propsId:number,
    showTip: boolean
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
    public gameCanvas:Node;

    public playArea:Node;

    public moveLock:Node;

    public tileMap:TileMap;

    public panelInfo:Node;

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

    public ghostFreezeNum:number = 0;
    public propsConfig:PropsConfig[];

    public playerPath:Array<Coord>;

    public ghostPath:Array<Coord>;

    public music:boolean;
    public soundEffect:boolean;
    public shake:boolean;

    public setMusicState(state:boolean) {
        sys.localStorage.setItem("music", state?"1":"0");
    }
    public getMusicState(): boolean {
        return sys.localStorage.getItem('music') == "1";
    }
    public setSoundEffectState(state:boolean) {
        sys.localStorage.setItem("soundEffect", state?"1":"0");
    }
    public getSoundEffectState(): boolean {
        return sys.localStorage.getItem('soundEffect') == "1";
    }
    public setShakeState(state:boolean) {
        sys.localStorage.setItem("shake", state?"1":"0");
    }
    public getShakeState(): boolean {
        return sys.localStorage.getItem('shake') == "1";
    }
    /**
     * 添加玩家路径
     * @param coord
     */
    public addPlayerPath(coord:Coord){
        if (!this.playerPath) {
            this.playerPath = new Array<Coord>();
        }
        this.playerPath.push(coord);
    }

    /**
     * 添加鬼路径
     * @param coord
     */
    public addGhostPath(coord:Coord){
        if (!this.ghostPath) {
            this.ghostPath = new Array<Coord>();
        }
        this.ghostPath.push(coord);
    }

    /**
     * 路径初始化
     */
    public pathInit() {
        this.playerPath = new Array<Coord>();
        this.ghostPath = new Array<Coord>();
    }

    public setPlayerInfo(playerInfo: PlayerInfo) {
        sys.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    }
    public getPlayerInfo(): PlayerInfo {
        let parse = JSON.parse(sys.localStorage.getItem('playerInfo'));
        // parse.gameLevel = 1;
        return parse
    }

    public setPropsConfig(config: PropsConfig[]) {
        sys.localStorage.setItem("propsConfig", JSON.stringify(config));
    }
    public setPropsConfigSingle(config:PropsConfig): void {
        if (config) {
            let allConfig = JSON.parse(sys.localStorage.getItem('propsConfig')) as PropsConfig[];
            for (let i = 0; i < allConfig.length; i++) {
                if (allConfig[i].propsId == config.propsId) {
                    allConfig[i] = config;
                    break;
                }
            }
            sys.localStorage.setItem("propsConfig", JSON.stringify(allConfig));
        }
    }
    public getPropsConfig(): PropsConfig[] {
        return JSON.parse(sys.localStorage.getItem('propsConfig'))
    }
    public getPropsConfigById(id:number): PropsConfig {
        let allConfig = JSON.parse(sys.localStorage.getItem('propsConfig')) as PropsConfig[];
        for (let i = 0; i < allConfig.length; i++) {
            if (allConfig[i].propsId == id) {
                return allConfig[i];
            }
        }
    }



    public playerNext() {
        let playerInfo = JSON.parse(sys.localStorage.getItem('playerInfo'))
        playerInfo.gameLevel++;
        sys.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    }

    propsConfigInit() {
        let allPropsConfig: PropsConfig[]= [
            {propsId:GamePropsEnum.OBSTACLE_RESET, showTip: false},
            {propsId:GamePropsEnum.BACK, showTip: false},
            {propsId:GamePropsEnum.FORECAST, showTip: true},
            {propsId:GamePropsEnum.FREEZE, showTip: true},
        ];
        this.setPropsConfig(allPropsConfig);
    }
}
