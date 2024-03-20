import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Popup} from "db://assets/Script/Popup";
import {GameStateEnum, Global, resume} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Node, instantiate, Prefab, resources, Label, UITransform,Toggle} from 'cc';


export class PopupPropsPrompt implements PopupBase {
    type: number = PopupEnum.PROPS_PROMPT;
    text:string
    resume:Function
    init() {
        let popup = UIManager.getInstance().maskGlobal.getChildByName("Popup");
        popup.removeAllChildren();
        // let tooltip = popup.getChildByName(popup.getComponent(Popup).promptTooltip.name)
        // if (tooltip) {
        //
        // }
        // 实例化预制体
        let tooltip  = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).promptTooltip);
        // 将实例化的预制体添加到场景中
        UIManager.getInstance().maskGlobal.getChildByName("Popup").addChild(tooltip)

        // let toggle = tooltip.getChildByName('Toggle');
        // toggle.on('toggle', (node)=>{
        //     // 判断下次点击道具是否弹出提示
        //     console.log(node.isChecked)
        // }, toggle);

        let continueButton = tooltip.getChildByName('ButtonGroup').getChildByName('Continue');
        // continueButton.on(Node.EventType.TOUCH_END, function (event) {
        //     console.log(continueButton.getParent().getParent().getChildByName("Toggle").getComponent(Toggle).isChecked);
        //
        // }, continueButton);
        continueButton.on(Node.EventType.TOUCH_END, this.resume, continueButton);
        let cancelButton = tooltip.getChildByName('ButtonGroup').getChildByName('Cancel');
        cancelButton.on(Node.EventType.TOUCH_END, function (event) {
            UIManager.getInstance().closeMaskGlobal();
        }, cancelButton);
        let background = UIManager.getInstance().maskGlobal.getChildByName('Background')
        if (!background.hasEventListener(Node.EventType.TOUCH_START)) {
            background.on(Node.EventType.TOUCH_START, ()=>{
                UIManager.getInstance().closeMaskGlobal();
            }, popup);
        }
        // 更新父节点的contentSize 避免弹框外的关闭弹框监听有误
        popup.getComponent(UITransform).setContentSize(tooltip.getComponent(UITransform).contentSize)

        UIManager.getInstance().maskGlobal.getChildByName('Background').on(Node.EventType.TOUCH_START, function (event) {
            UIManager.getInstance().closeMaskGlobal();
        }, this);
        tooltip.getChildByName('Label').getComponent(Label).string = this.text;

    }

}
