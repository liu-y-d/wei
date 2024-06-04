import {Node,Vec2,sys} from "cc";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {AudioMgr} from "db://assets/Script/AudioMgr";
import {getAllPropsGuide, GetGlobalPropsConfig, GlobalProps, saveUserPropsGuide} from "db://assets/Script/Request";

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

    public serverAddrProd:string = 'https://boolbool.online/api/'
    public serverAddrDev:string = 'http://localhost:8088/api/'

    public getPath(path:string){
        return this.serverAddrProd + path;
    }
    gameState:GameStateEnum = GameStateEnum.ready;
    public gameCanvas:Node;

    public playArea:Node;

    public rsa

    constructor() {
        //@ts-ignore
        this.rsa = new JSEncrypt()
        this.rsa.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtIDVyXvlfWqEbwkdZ9qJ
ZoImIOqUdtu7MXdyyQzGB/nWT6DU0T+dkkFQfeo/it+rf6BloZNMXtpWHwzIgAuv
0+xzZnp9KgII6FA2/iqNsZhbGpHHgy23dzMbxYM2AoUE1DccYStR/9yyUx32v4nK
fwTfKEYojHDrrMGnWSQHH5qMKcvbgloUq1DmCYrSDdGnSF2LS4b6xs5K2VRXIrYt
cgxf7hDAPpiDYd8yUI9VQ6FHiyBkifTBg8LEkUnRiez942W/vWoJ1KUG/ae35MRc
w9gMn52O8IzUun9ROjoDA25qYqvWW7j+tUhNOOK9y7VNkzn6cyFlWtP+MxqNOg7R
fQIDAQAB
-----END PUBLIC KEY-----`)
    }
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
    public jiaSuDaiPath:Array<Coord>;

    public music:boolean;
    public soundEffect:boolean;
    public shake:boolean;

    public setMusicState(state:boolean) {
        if (state) {
            AudioMgr.inst.play('bgm',0.5)
        }else {
            AudioMgr.inst.stop()
        }
        sys.localStorage.setItem("music", state?"1":"0");
    }

    public setToken(token:string) {
        sys.localStorage.setItem("token", token);
    }
    public getToken() : string{
        return sys.localStorage.getItem("token");
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
     * 添加鬼路径
     * @param coord
     */
    public addJiaSuDaiPath(coord:Coord){
        if (!this.jiaSuDaiPath) {
            this.jiaSuDaiPath = new Array<Coord>();
        }
        this.jiaSuDaiPath.push(coord);
    }

    /**
     * 路径初始化
     */
    public pathInit() {
        this.playerPath = new Array<Coord>();
        this.ghostPath = new Array<Coord>();
        this.jiaSuDaiPath = new Array<Coord>();
    }

    public setPlayerInfo(playerInfo: PlayerInfo) {
        sys.localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
    }
    public getPlayerInfo(): PlayerInfo {
        let storage = sys.localStorage.getItem('playerInfo');
        if (storage) {
            let parse = JSON.parse(storage);
            // parse.gameLevel = 1;
            return parse
        }

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
            saveUserPropsGuide(config.propsId,config.showTip)
        }
    }
    public getPropsConfig(): PropsConfig[] {
        let item = sys.localStorage.getItem('propsConfig');
        if (item){
            return JSON.parse(item) as PropsConfig[]
        }
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

        let custom = this.getPropsConfig();
        if (!custom){
            getAllPropsGuide((guides)=>{
                if (guides && guides.length > 0) {
                    let propsMap = guides.reduce((map:Map<number,GlobalProps>, obj) => {
                            map.set(obj.propsId, obj.show);
                            return map;
                        }, new Map());
                    let allPropsConfig: PropsConfig[]= [
                        {propsId:GamePropsEnum.OBSTACLE_RESET, showTip: propsMap.get(GamePropsEnum.OBSTACLE_RESET)?propsMap.get(GamePropsEnum.OBSTACLE_RESET):true},
                        {propsId:GamePropsEnum.BACK, showTip: propsMap.get(GamePropsEnum.BACK)?propsMap.get(GamePropsEnum.BACK):true},
                        {propsId:GamePropsEnum.FORECAST, showTip: propsMap.get(GamePropsEnum.FORECAST)?propsMap.get(GamePropsEnum.FORECAST):true},
                        {propsId:GamePropsEnum.FREEZE, showTip: propsMap.get(GamePropsEnum.FREEZE)?propsMap.get(GamePropsEnum.FREEZE):true},
                        {propsId:GamePropsEnum.CreateStar, showTip: propsMap.get(GamePropsEnum.CreateStar)?propsMap.get(GamePropsEnum.CreateStar):true},
                        {propsId:GamePropsEnum.CreateDirection, showTip: propsMap.get(GamePropsEnum.CreateDirection)?propsMap.get(GamePropsEnum.CreateDirection):true},
                        {propsId:GamePropsEnum.CreateStarAbsorb, showTip: propsMap.get(GamePropsEnum.CreateStarAbsorb)?propsMap.get(GamePropsEnum.CreateStarAbsorb):true},
                    ];
                    this.setPropsConfig(allPropsConfig);

                }else {

                    let allPropsConfig: PropsConfig[]= [
                        {propsId:GamePropsEnum.OBSTACLE_RESET, showTip: true},
                        {propsId:GamePropsEnum.BACK, showTip: true},
                        {propsId:GamePropsEnum.FORECAST, showTip: true},
                        {propsId:GamePropsEnum.FREEZE, showTip: true},
                        {propsId:GamePropsEnum.CreateStar, showTip: true},
                        {propsId:GamePropsEnum.CreateDirection, showTip: true},
                        {propsId:GamePropsEnum.CreateStarAbsorb, showTip: true},
                    ];
                    this.setPropsConfig(allPropsConfig);
                }
            })


        }
    }
    dateToSeconds(dateString) {
        const date = new Date(dateString);
        return Math.floor(date.getTime() / 1000);
    }

    getGlobalPropsConfig() {
        let item = sys.localStorage.getItem('GlobalProps');
        if (item){
            return JSON.parse(item) as GlobalProps[]
        }
    }
}
