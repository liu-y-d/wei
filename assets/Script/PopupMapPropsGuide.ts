import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, RichText, tween, UITransform,Vec3,Graphics,Widget} from 'cc';
import {GameStateEnum, Global, PropsConfig} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";
import {Guide} from "db://assets/Script/PopupGuide";
import {ShapeEnum} from "db://assets/Script/ShapeManager";
import {GamePropsEnum} from "db://assets/Script/BaseProps";

export class PopupMapPropsGuide implements PopupBase {
    type: number = PopupEnum.mapPropsGuide;

    propsId:number
    resume:Function
    guides: Guide[]
    init() {
        let popup = UIManager.getInstance().maskGuideGlobal.getChildByName("Popup");
        popup.removeAllChildren();
        let guide = popup.getChildByName(popup.getComponent(Popup).mapPropsGuide.name)
        popup.scale = new Vec3(1,1,1);
        let component = popup.getComponent(UITransform);
        if (!guide) {
            // 实例化预制体
            guide = instantiate(UIManager.getInstance().maskGuideGlobal.getChildByName("Popup").getComponent(Popup).mapPropsGuide);
            guide.scale = new Vec3(0,1,1);
            let guideIndex = 0;
            let self = this;

            function showGuide() {
                if (guideIndex < self.guides.length) {
                    let guideMode = self.guides[guideIndex];
                    let text = guide.getChildByName("Text");
                    let toggle = guide.getChildByPath("Node/Toggle");
                    // if (guideMode.angle) {
                    //     // guide.angle = guideMode.angle
                    //     // let textPos = text.getPosition();
                    //     // let togglePos = toggle.getPosition().clone();
                    //     text.angle = guideMode.angle
                    //     toggle.angle = guideMode.angle
                    //     // toggle.setPosition(textPos)
                    //     // text.setPosition(togglePos)
                    //
                    // }
                    // if (guideMode.scaleX) {
                    //     guide.scale = new Vec3(guideMode.scaleX,0,1)
                    //     text.scale = new Vec3(guideMode.scaleX,1,1)
                    //     toggle.scale = new Vec3(guideMode.scaleX,1,1)
                    // }
                    text.getChildByName("RichText").getComponent(RichText).string = guideMode.tip;
                    let pos = popup.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(guideMode.pos.x, guideMode.pos.y,0))
                    let gra = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(Graphics);
                    gra.clear();
                    gra.circle(pos.x, pos.y + 10 , LevelDesign.getInstance().currentShapeEnum == ShapeEnum.FOUR? LevelDesign.getInstance().getShapeManager().innerCircleRadius + 10: LevelDesign.getInstance().getShapeManager().innerCircleRadius*2+ 10);
                    gra.stroke();
                    gra.fill();
                    function adjustPos() {
                        if (guideMode.angle) {
                            pos.y = pos.y + guide.getComponent(UITransform).height/2;
                            if (guideMode.scaleX) {
                                pos.x = pos.x - guide.getComponent(UITransform).width * 0.2;
                            }else {
                                pos.x = pos.x + guide.getComponent(UITransform).width * 0.2;
                            }
                        }else {
                            pos.y = pos.y - guide.getComponent(UITransform).height/2;

                            if (guideMode.scaleX) {
                                pos.x = pos.x + guide.getComponent(UITransform).width * 0.2;
                            }else {
                                pos.x = pos.x - guide.getComponent(UITransform).width * 0.2;
                            }
                        }


                    }
                    // adjustPos()
                    let tween1 = tween(guide);
                    // if (guide.scale.x != 0) {
                    //     tween1.to(0.2, {scale: new Vec3(0, 0, 1)});
                    // }
                    // if (guideMode.angle) {
                    //     tween1.to(0, {angle: guideMode.angle})
                    // }
                    tween1
                        // .to(0, {position: pos})
                        // .to(0.2, {scale: new Vec3(guideMode.scaleX?guideMode.scaleX:1, 1, 1)}).call(() => {
                        .to(0.2, {scale: new Vec3(1,1,1)}).call(() => {
                        guideIndex++;
                    }).call(()=>{
                        // let gra = guide.getParent().getParent().getComponent(Graphics);
                        // gra.lineWidth = 10;
                        // gra.fillColor.fromHEX('#ff0000');
                        // gra.roundRect(pos.x, pos.y, 100, 100,10);
                        // gra.close();
                        // gra.stroke();
                        // gra.fill();
                    }).start();
                }


            }
            // 将实例化的预制体添加到场景中
            popup.addChild(guide)
            let widget = guide.getComponent(Widget);
            // // 设置对齐单位是 %
            widget!.isAbsoluteTop = false;
            widget!.top = 0.1;
            guide.getChildByPath("Node/Toggle").on('toggle', (node)=>{
                let config: PropsConfig = {
                    propsId: self.propsId,
                    showTip: !node.isChecked
                }
                Global.getInstance().setPropsConfigSingle(config);
            }, guide);
            let background = UIManager.getInstance().maskGuideGlobal.getChildByPath('Mask/Background');
            UIManager.getInstance().adapterContentSize(background);
            background.off(Node.EventType.TOUCH_START);
            background.on(Node.EventType.TOUCH_START, function (event) {
                UIManager.getInstance().closeMaskGuideGlobal();
                self.resume()
            }, this);
            guide.off(Node.EventType.TOUCH_END);
            guide.on(Node.EventType.TOUCH_END, function (event) {
                if (guideIndex >= self.guides.length) {
                    UIManager.getInstance().closeMaskGuideGlobal();
                    self.resume()
                }else {
                    showGuide();
                }
            }, guide);
            // background.setSiblingIndex(1)
            showGuide();
            // tween(popup)
            //     .to(0.2,{scale:new Vec3(1,1,1)}).call(()=>{
            // }).start();
            guide.getParent().getComponent(UITransform).setContentSize(guide.getParent().getParent().getComponent(UITransform).contentSize)
            // });
        }

    }

}
