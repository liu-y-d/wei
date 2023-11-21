import randomSolver from "db://assets/Script/RandomSolver";
import nearestAndMoreRoutesSolver from "db://assets/Script/NearestSolver";

export class LevelDesign{

    private static _instance: LevelDesign;
    public static getInstance(): LevelDesign {
        if (!this._instance) {
            this._instance = new LevelDesign();
        }
        return this._instance;
    }

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
     * 鬼移动算法
     */
    public ghostMoveAlgorithms:Function = randomSolver;

    init(){
        if (this.currentLevel % 5 == 0) {
            this.showGhostDirection = false;
            this.difficultyLevel = DifficultyLevelEnum.difficulty;
            this.ghostMoveAlgorithms = nearestAndMoreRoutesSolver;
        }else {
            this.showGhostDirection = true;
            this.difficultyLevel = DifficultyLevelEnum.easy;
        }
    }


}
export enum DifficultyLevelEnum{
    easy="简单",
    difficulty="困难"
}