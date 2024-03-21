import randomSolver from "db://assets/Script/RandomSolver";
import nearestAndMoreRoutesSolver from "db://assets/Script/NearestSolver";
import {ShapeEnum, ShapeManager} from "db://assets/Script/ShapeManager";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {SquareManager} from "db://assets/Script/SquareManager";
import {Coord, Global} from "db://assets/Script/Global";
import {PropsBack} from "db://assets/Script/PropsBack";
import {PropsForecast} from "db://assets/Script/PropsForecast";
import {PropsObstacleReset} from "db://assets/Script/PropsObstacleReset";
import {BaseProps} from "db://assets/Script/BaseProps";
import {PropsFreeze} from "db://assets/Script/PropsFreeze";

export class LevelDesign{

    private static _instance: LevelDesign;
    public static getInstance(): LevelDesign {
        if (!this._instance) {
            this._instance = new LevelDesign();
        }
        return this._instance;
    }

    public shapeManagers:Map<ShapeEnum, ShapeManager> = new Map<ShapeEnum, ShapeManager>();
    // /**
    //  * 当前关卡
    //  * @private
    //  */
    // public currentLevel:number = 1;

    /**
     * 关卡难度
     * @private
     */
    public difficultyLevel:DifficultyLevelEnum

    public bulletArray:Array<string>;

    public difficultyDetails: { [key in keyof typeof DifficultyLevelEnum]: DifficultyInfo } = {
        Easy: { bgColor: '#90EE90',fontColor: '#333333', description: '简单' },
        Medium: { bgColor: '#4682B4',fontColor: '#FFFFFF', description: '普通' },
        Hard: { bgColor: '#C0392B',fontColor: '#FFFFFF', description: '困难' },
    };
    /**
     * 显示鬼的行进方向
     * @private
     */
    public showGhostDirection:boolean;

    /**
     * 当前地图布局
     */
    public currentShapeEnum:ShapeEnum;

    /**
     * 当前关卡道具数组
     */
    public levelPropsArray:Map<number,BaseProps>

    /**
     * 当前关卡各个道具可使用数量
     */
    public propsUsableConfig: Map<number,number>

    public currentMovableDirection:number;

    /**
     * 当前关卡目的地集合
     */
    public currentDestination:Array<Coord> = new Array<Coord>();

    /**
     * 鬼移动算法
     */
    public ghostMoveAlgorithms:Function = randomSolver;

    init(){
        this.shapeManagers.set(ShapeEnum.SIX, new HexagonManager())
        this.shapeManagers.set(ShapeEnum.FOUR, new SquareManager())
        this.bulletArray = new Array<string>();

        // this.showGhostDirection = true;
        // this.difficultyLevel = DifficultyLevelEnum.Easy;
        // this.currentShapeEnum = ShapeEnum.SIX;
        // Global.getInstance().defaultObstacleNum = 10;
        // this.bulletArray.push(BulletEnum.FourDirection,BulletEnum.RandomMove,BulletEnum.ShowNext)
        if (Global.getInstance().getPlayerInfo().gameLevel % 5 == 0) {


            let random = Math.floor(Math.random() * 10);
            this.showGhostDirection = false;
            Global.getInstance().defaultObstacleNum = 10;
            this.difficultyLevel = DifficultyLevelEnum.Hard;
            if ((random &1) == 1) {
                this.currentShapeEnum = ShapeEnum.SIX;
                this.currentMovableDirection = 6;
                this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
                this.bulletArray.push(BulletEnum.SixDirection,BulletEnum.SmartMove)
            }else {
                this.currentShapeEnum = ShapeEnum.FOUR;
                this.currentMovableDirection = 8;
                this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
                this.bulletArray.push(BulletEnum.EightDirection,BulletEnum.SmartMove)
            }



        }else {
            this.showGhostDirection = true;
            this.difficultyLevel = DifficultyLevelEnum.Easy;
            this.currentShapeEnum = ShapeEnum.FOUR;
            this.currentMovableDirection = 4;
            Global.getInstance().defaultObstacleNum = 10;
            this.bulletArray.push(BulletEnum.FourDirection,BulletEnum.RandomMove,BulletEnum.ShowNext)
        }
        this.shapeManagers.get(this.currentShapeEnum).initDestination()
        this.propsInit();
    }
    propsInit() {
        this.levelPropsArray = new Map<number,BaseProps>();
        let propsBack = new PropsBack();
        let propsObstacleReset = new PropsObstacleReset();
        let propsFreeze = new PropsFreeze();
        let propsUsableConfig = new Map<number,number>();
        propsUsableConfig.set(propsBack.id,propsBack.defaultNum);
        this.levelPropsArray.set(propsBack.id,propsBack);

        let propsForecast = new PropsForecast();
        propsUsableConfig.set(propsForecast.id,propsForecast.defaultNum);
        this.levelPropsArray.set(propsForecast.id,propsForecast);
        this.levelPropsArray.set(propsObstacleReset.id,propsObstacleReset);
        propsUsableConfig.set(propsObstacleReset.id,propsObstacleReset.defaultNum);
        this.levelPropsArray.set(propsFreeze.id,propsFreeze);
        propsUsableConfig.set(propsFreeze.id,propsFreeze.defaultNum);
        this.propsUsableConfig = propsUsableConfig;

        Global.getInstance().ghostFreezeNum = 0;
    }
    getDifficultyInfoByEnum(difficulty: DifficultyLevelEnum): DifficultyInfo | undefined {
        return this.difficultyDetails[difficulty];
    }
    getDifficultyInfo(): DifficultyInfo | undefined {
        return this.difficultyDetails[this.difficultyLevel];
    }
    getShapeManager():ShapeManager {
        return this.shapeManagers.get(this.currentShapeEnum);
    }


}
interface DifficultyInfo {
    bgColor: string;
    fontColor: string;
    description: string;
}

export enum DifficultyLevelEnum{
    Easy='Easy',
    Medium='Medium',
    Hard='Hard'
}
export enum BulletEnum{
    ShowNext='显示移动预测',
    FourDirection='四方向移动',
    SixDirection='六方向移动',
    EightDirection='八方向移动',
    RandomMove='随机移动',
    SmartMove='智能移动',
}
