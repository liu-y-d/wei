import {Node} from "cc";
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";

export class UIManager{
    private static _instance: UIManager;
    public static getInstance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    /**
     * 全局遮罩
     */
    maskGlobal:Node;

    // /**
    //  * 结束游戏提示
    //  */
    // gameOverTooltip:Node;

    public openMaskGlobal(){
        Global.getInstance().gameCanvas.getChildByName('MaskGlobal').active = true;
    }

    public closeMaskGlobal(){
        Global.getInstance().gameCanvas.getChildByName('MaskGlobal').active = false;
    }

    public gameOver(state:GameStateEnum) {
        this.openMaskGlobal()
        let tooltip = Global.getInstance().gameCanvas.getChildByName('MaskGlobal').getChildByName('Tooltip');
        if (state == GameStateEnum.lose) {
            tooltip.getChildByName('TooltipLayout').getChildByName('Label').string = '失败'
            tooltip.active = true;
            Global.getInstance().gameState = GameStateEnum.lose;
        }
        if (state == GameStateEnum.win) {
            tooltip.getChildByName('TooltipLayout').getChildByName('Label').string = '胜利'
            Global.getInstance().gameState = GameStateEnum.win;
        }
        LevelDesign.getInstance().getShapeManager().closeDirect();
        tooltip.active = true;
        let continueButton = tooltip.getChildByName('TooltipLayout').getChildByName('ButtonGroup').getChildByName('Continue');
        continueButton.on(Node.EventType.TOUCH_END, function (event) {
            // event.stopPropagation(); // 可选，阻止事件向上冒泡

            console.log('继续按钮被点击了！');
            // 例如，可以调用一个函数
            UIManager.getInstance().gameContinue();
        }, this);

    }

    public backMain() {

    }
    public gameContinue() {
        this.closeMaskGlobal()
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game);
    }
}