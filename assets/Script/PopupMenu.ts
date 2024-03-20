import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, resources, Label, Toggle} from 'cc';
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";

export class PopupMenu implements PopupBase {
    type: number = PopupEnum.MENU;
    resume:Function
    init() {
        let popup = UIManager.getInstance().maskGlobal.getChildByName("Popup");
        popup.removeAllChildren();
        let tooltip = popup.getChildByName(popup.getComponent(Popup).menuTooltip.name)

        if (!tooltip) {
            // 实例化预制体
            tooltip = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).menuTooltip);


            tooltip.getChildByName("Close").on(Node.EventType.TOUCH_END,()=>{
                UIManager.getInstance().closeMaskGlobal();
            })


            let retryButton = tooltip.getChildByName('ButtonGroup').getChildByName('Retry');
            // retryButton.on(Node.EventType.TOUCH_END, function (event) {
            //     // 例如，可以调用一个函数
            //     UIManager.getInstance().gameContinue();
            // }, this);
            retryButton.on(Node.EventType.TOUCH_END, ()=>{
                UIManager.getInstance().gameContinue();
            }, this);
            let backButton = tooltip.getChildByName('ButtonGroup').getChildByName('Exit');
            backButton.on(Node.EventType.TOUCH_END, function (event) {
                UIManager.getInstance().backMain();
            }, this);

            let music = tooltip.getChildByName("ToggleGroup").getChildByName('Music')
            music.getComponent(Toggle).isChecked = Global.getInstance().getMusicState();
            music.on('toggle', (node)=>{
                // 判断下次点击道具是否弹出提示
                Global.getInstance().setMusicState(node.isChecked)
            }, music);
            let soundEffect = tooltip.getChildByName("ToggleGroup").getChildByName('SoundEffect');
            soundEffect.getComponent(Toggle).isChecked = Global.getInstance().getSoundEffectState();
            soundEffect.on('toggle', (node)=>{
                // 判断下次点击道具是否弹出提示
                Global.getInstance().setSoundEffectState(node.isChecked)
            }, soundEffect);
            let Shake = tooltip.getChildByName("ToggleGroup").getChildByName('Shake');
            Shake.getComponent(Toggle).isChecked = Global.getInstance().getShakeState();
            Shake.on('toggle', (node)=>{
                // 判断下次点击道具是否弹出提示
                Global.getInstance().setShakeState(node.isChecked)
            }, Shake);
            // 将实例化的预制体添加到场景中
            UIManager.getInstance().maskGlobal.getChildByName("Popup").addChild(tooltip)
            // 取消监听
            UIManager.getInstance().maskGlobal.getChildByName('Background').off(Node.EventType.TOUCH_START);
            UIManager.getInstance().maskGlobal.getChildByName('Background').on(Node.EventType.TOUCH_START, function (event) {
                // UIManager.getInstance().closeMaskGlobal();
            }, this);
            // tooltip.getParent().getComponent(UITransform).setContentSize(tooltip.getComponent(UITransform).contentSize)
            // });
        }

    }

}
