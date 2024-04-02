import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, tween, Label, Vec3} from 'cc';
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";

export class PopupGameOver implements PopupBase {
    type: number = PopupEnum.GAME_OVER;
    overType: boolean
    resume:Function
    init() {
        let popup = UIManager.getInstance().maskGlobal.getChildByName("Popup");
        popup.removeAllChildren();
        popup.scale = new Vec3(0,0,1);
        let tooltip;
        if (this.overType) {
            tooltip = popup.getChildByName(popup.getComponent(Popup).gameOverWinTooltip.name)
        }else {
            tooltip = popup.getChildByName(popup.getComponent(Popup).gameOverLoseTooltip.name)
        }

        if (!tooltip) {
            // 实例化预制体

            if (this.overType) {
                tooltip = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).gameOverWinTooltip);
            }else {
                tooltip = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).gameOverLoseTooltip);
            }


            let continueButton = tooltip.getChildByName('TooltipLayout').getChildByName('ButtonGroup').getChildByName('Continue');
            // continueButton.on(Node.EventType.TOUCH_END, function (event) {
            //     // 例如，可以调用一个函数
            //     UIManager.getInstance().gameContinue();
            // }, this);
            continueButton.on(Node.EventType.TOUCH_END, this.resume, this);
            let backButton = tooltip.getChildByName('TooltipLayout').getChildByName('ButtonGroup').getChildByName('Back');
            backButton.on(Node.EventType.TOUCH_END, function (event) {
                UIManager.getInstance().backMain();
            }, this);
            // 将实例化的预制体添加到场景中
            UIManager.getInstance().maskGlobal.getChildByName("Popup").addChild(tooltip)
            UIManager.getInstance().maskGlobal.getChildByName('Background').off(Node.EventType.TOUCH_START);
            UIManager.getInstance().maskGlobal.getChildByName('Background').on(Node.EventType.TOUCH_START, function (event) {
                // UIManager.getInstance().closeMaskGlobal();
            }, this);
            console.log(UIManager.getInstance().maskGlobal.getChildByName('Background').hasEventListener(Node.EventType.TOUCH_START))
            // tooltip.getParent().getComponent(UITransform).setContentSize(tooltip.getComponent(UITransform).contentSize)
            // });
        }
        if (this.overType) {
            // tooltip.getChildByName('TooltipLayout').getChildByName('Label').getComponent(Label).string = '胜利';
            Global.getInstance().gameState = GameStateEnum.win;
        } else {
            // tooltip.getChildByName('TooltipLayout').getChildByName('Label').getComponent(Label).string = '失败';
            Global.getInstance().gameState = GameStateEnum.lose;
        }
        if (LevelDesign.getInstance().showGhostDirection) {
            LevelDesign.getInstance().getShapeManager().closeDirect();
        }

        tween(popup)
            .to(0.2,{scale:new Vec3(1,1,1)}).call(()=>{

        }).start();
    }

}
