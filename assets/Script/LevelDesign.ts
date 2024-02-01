import randomSolver from "db://assets/Script/RandomSolver";
import nearestAndMoreRoutesSolver from "db://assets/Script/NearestSolver";
import {ShapeEnum, ShapeManager} from "db://assets/Script/ShapeManager";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {SquareManager} from "db://assets/Script/SquareManager";

export class LevelDesign{

    private static _instance: LevelDesign;
    public static getInstance(): LevelDesign {
        if (!this._instance) {
            this._instance = new LevelDesign();
        }
        return this._instance;
    }

    public shapeManagers:Map<ShapeEnum, ShapeManager> = new Map<ShapeEnum, ShapeManager>();
    /**
     * 当前关卡
     * @private
     */
    public currentLevel:number = 1;

    /**
     * 关卡难度
     * @private
     */
    public difficultyLevel:DifficultyLevelEnum

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
     * 鬼移动算法
     */
    public ghostMoveAlgorithms:Function = randomSolver;

    init(){
        this.shapeManagers.set(ShapeEnum.SIX, new HexagonManager())
        this.shapeManagers.set(ShapeEnum.FOUR, new SquareManager())
        if (this.currentLevel % 5 == 0) {
            this.showGhostDirection = false;
            this.difficultyLevel = DifficultyLevelEnum.difficulty;
            this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
        }else {
            this.showGhostDirection = true;
            this.difficultyLevel = DifficultyLevelEnum.easy;
        }
    }
    getShapeManager():ShapeManager {
        this.currentShapeEnum = ShapeEnum.FOUR;
        return this.shapeManagers.get(ShapeEnum.FOUR);
    }


}
export enum DifficultyLevelEnum{
    easy="简单",
    difficulty="困难"
}