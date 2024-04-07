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

export type LevelSettings = {
    Easy: LevelSetting,
    Medium: LevelSetting,
    Hard: LevelSetting,
}
export type LevelSetting ={
    initialObstacleCount: number,
    moveProbability: { random: number, towardsTarget: number },
    directions: number,
    targetPoints:number
}
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

    // 定义难度循环周期
    public difficultyCycleLength = 15; // 假设30关为一个难度循环周期
    public difficultySettings:LevelSettings  = {
        Easy: {
            initialObstacleCount: 10,
            moveProbability: { random: 0.7, towardsTarget: 0.3 }, // 简单难度下随机移动较多
            directions: 4, // 简单难度下只有上下左右移动
            targetPoints:10
        },
        Medium: {
            initialObstacleCount: 8,
            moveProbability: { random: 0.5, towardsTarget: 0.5 }, // 中等难度下随机和最近目标移动均衡
            directions: 6, // 中等难度6
            targetPoints:8
        },
        Hard: {
            initialObstacleCount: 6,
            moveProbability: { random: 0.3, towardsTarget: 0.7 }, // 困难难度下最近目标移动较多
            directions: 8, // 困难难度下支持上下左右和对角线移动
            targetPoints:6
        },
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
    public ghostMoveAlgorithms:Function = this.ghostMoveSelect;

    ghostMoveSelect (...param) {
        let difficultyLevel = this.calculateDifficultyLevel(Global.getInstance().getPlayerInfo().gameLevel);
        let difficultyParametersForLevel = this.getDifficultyParametersForLevel(difficultyLevel);
        // 生成一个随机数，范围在0到1之间
        let randomValue = Math.random();
        if (randomValue <= difficultyParametersForLevel.moveProbability.random) {
            // 随机移动
            this.ghostMoveAlgorithms = randomSolver;
        } else {
            // 向目标点移动
            this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
        }
        return this.ghostMoveAlgorithms(...param)

    }

    init(){
        this.shapeManagers.set(ShapeEnum.SIX, new HexagonManager())
        this.shapeManagers.set(ShapeEnum.FOUR, new SquareManager())
        this.bulletArray = new Array<string>();
        let difficultyLevel = this.calculateDifficultyLevel(Global.getInstance().getPlayerInfo().gameLevel);
        let difficultyParametersForLevel = this.getDifficultyParametersForLevel(difficultyLevel);
        // this.showGhostDirection = true;
        // this.difficultyLevel = DifficultyLevelEnum.Easy;
        // this.currentShapeEnum = ShapeEnum.SIX;
        // Global.getInstance().defaultObstacleNum = 10;
        // this.bulletArray.push(BulletEnum.FourDirection,BulletEnum.RandomMove,BulletEnum.ShowNext)

        this.difficultyLevel = difficultyLevel
        if (Global.getInstance().getPlayerInfo().gameLevel == 1) {
            this.showGhostDirection = true;
            this.bulletArray.push(BulletEnum.ShowNext)
        }else {
            this.showGhostDirection = false;
        }
        this.showGhostDirection = Global.getInstance().getPlayerInfo().gameLevel == 1;
        if (difficultyParametersForLevel) {
            switch (this.difficultyLevel) {
                case DifficultyLevelEnum.Easy:
                    this.currentShapeEnum = ShapeEnum.FOUR;
                    this.bulletArray.push(BulletEnum.FourDirection,BulletEnum.SmartMove,BulletEnum.RandomMove)
                    break;
                case DifficultyLevelEnum.Medium:
                    this.currentShapeEnum = ShapeEnum.SIX;
                    this.bulletArray.push(BulletEnum.SixDirection,BulletEnum.SmartMove,BulletEnum.RandomMove)
                    break;
                case DifficultyLevelEnum.Hard:
                    this.currentShapeEnum = ShapeEnum.FOUR;
                    this.bulletArray.push(BulletEnum.EightDirection,BulletEnum.SmartMove,BulletEnum.RandomMove)
                    break;
            }
            Global.getInstance().defaultObstacleNum = difficultyParametersForLevel.initialObstacleCount;
            this.currentMovableDirection = difficultyParametersForLevel.directions;
        }


        // if (Global.getInstance().getPlayerInfo().gameLevel % 5 == 0) {
        //
        //
        //     let random = Math.floor(Math.random() * 10);
        //     this.showGhostDirection = false;
        //     Global.getInstance().defaultObstacleNum = 10;
        //     this.difficultyLevel = DifficultyLevelEnum.Hard;
        //     if ((random &1) == 1) {
        //         this.currentShapeEnum = ShapeEnum.SIX;
        //         this.currentMovableDirection = 6;
        //         this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
        //         this.bulletArray.push(BulletEnum.SixDirection,BulletEnum.SmartMove)
        //     }else {
        //         this.currentShapeEnum = ShapeEnum.FOUR;
        //         this.currentMovableDirection = 8;
        //         this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
        //         this.bulletArray.push(BulletEnum.EightDirection,BulletEnum.SmartMove)
        //     }
        //
        //
        //
        // }else {
        //
        //     this.difficultyLevel = DifficultyLevelEnum.Easy;
        //     this.currentShapeEnum = ShapeEnum.FOUR;
        //     this.currentMovableDirection = 4;
        //     Global.getInstance().defaultObstacleNum = 10;
        //     this.bulletArray.push(BulletEnum.FourDirection,BulletEnum.RandomMove,BulletEnum.ShowNext)
        // }
        this.shapeManagers.get(this.currentShapeEnum).initDestination(difficultyParametersForLevel.targetPoints)
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




    // 计算当前难度等级
    calculateDifficultyLevel(currentLevel) {
        const withinCycleLevel = currentLevel % this.difficultyCycleLength;

        // 根据循环内关卡数决定难度等级
        if (withinCycleLevel < this.difficultyCycleLength / 3) {
            return DifficultyLevelEnum.Easy;
        } else if (withinCycleLevel < 2 * this.difficultyCycleLength / 3) {
            return DifficultyLevelEnum.Medium;
        } else {
            return DifficultyLevelEnum.Hard;
        }
    }

    // 获取特定关卡的难度参数
    getDifficultyParametersForLevel(difficultyLevel):LevelSetting {
        const baseSetting = this.difficultySettings[difficultyLevel];

        return {
            ...baseSetting
        };
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
    load_tip = '🌈友情提示：在试运营阶段，我们将暂不储存用户数据信息。',
    load_1 = '🌳这里是一个结合休闲益智与策略布局的游戏世界。',
    load_4 = '🦥布布已经准备好在棋局中与您一决高下，谁能笑到最后？让我们共同探索这片神秘棋盘森林！',
    load_3 = '🌈您已进入布布的地盘！在这片轻松愉快的益智乐园里，发挥您的机智与谋略，看准时机，步步为营，让布布无处可逃！',
    load_2 = '🦥布布：我是一只时而机灵、时而迷糊的树懒。'
}
