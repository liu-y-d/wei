import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, resources, tween, Toggle,Vec3} from 'cc';
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";

export class PopupMainMenu implements PopupBase {
    type: number = PopupEnum.MAIN_MENU;
    resume:Function
    init() {
        let popup = UIManager.getInstance().maskGlobal.getChildByName("Popup");

        UIManager.getInstance().maskGlobal.getChildByName("Firework").active = false
        popup.removeAllChildren();
        let tooltip = popup.getChildByName(popup.getComponent(Popup).menuTooltip.name)
        popup.scale = new Vec3(0,0,1);
        if (!tooltip) {
            // 实例化预制体
            tooltip = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).mainMenuTooltip);


            tooltip.getChildByName("Close").on(Node.EventType.TOUCH_END,()=>{
                UIManager.getInstance().closeMaskGlobal();
            })

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
            let background = UIManager.getInstance().maskGlobal.getChildByName('Background');
            // UIManager.getInstance().adapterContentSize(background);
            background.off(Node.EventType.TOUCH_START);
            background.on(Node.EventType.TOUCH_START, function (event) {
            }, background);
            // background.setSiblingIndex(1)

            tween(popup)
                .to(0.2,{scale:new Vec3(1,1,1)}).call(()=>{

            }).start();
            // tooltip.getParent().getComponent(UITransform).setContentSize(tooltip.getComponent(UITransform).contentSize)
            // });
        }

    }

}
