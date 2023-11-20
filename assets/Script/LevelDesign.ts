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
    private currentLevel:number;

    /**
     * 关卡难度
     * @private
     */
    private difficultyLevel:DifficultyLevelEnum


}
export enum DifficultyLevelEnum{
    easy="简单",
    difficulty="困难"
}