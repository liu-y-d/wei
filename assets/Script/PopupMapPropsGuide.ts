import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, RichText, tween, UITransform,Vec3} from 'cc';
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";
import {Guide} from "db://assets/Script/PopupGuide";

export class PopupMapPropsGuide implements PopupBase {
    type: number = PopupEnum.mapPropsGuide;

    resume:Function
    guides: Guide[]
    init() {
        let popup = UIManager.getInstance().maskGlobal.getChildByName("Popup");
        popup.removeAllChildren();
        let guide = popup.getChildByName(popup.getComponent(Popup).mapPropsGuide.name)
        popup.scale = new Vec3(1,1,1);
        let component = popup.getComponent(UITransform);
        if (!guide) {
            // 实例化预制体
            guide = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).mapPropsGuide);
            guide.scale = new Vec3(0,0,1);
            let guideIndex = 0;
            let self = this;

            function showGuide() {
                if (guideIndex < self.guides.length) {
                    let guideMode = self.guides[guideIndex];
                    if (guideMode.angle) {
                        guide.angle = guideMode.angle
                        guide.getChildByName("Text").angle = guideMode.angle
                    }
                    if (guideMode.scaleX) {
                        guide.scale = new Vec3(guideMode.scaleX,0,1)
                        guide.getChildByName("Text").scale = new Vec3(guideMode.scaleX,1,1)
                    }
                    guide.getChildByName("Text").getChildByName("RichText").getComponent(RichText).string = guideMode.tip;
                    let pos = popup.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(guideMode.pos.x, guideMode.pos.y,0))
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
                    adjustPos()
                    let tween1 = tween(guide);
                    if (guide.scale.x != 0) {
                        tween1.to(0.2, {scale: new Vec3(0, 0, 1)});
                    }
                    if (guideMode.angle) {
                        tween1.to(0, {angle: guideMode.angle})
                    }
                    tween1
                        .to(0, {position: pos})
                        .to(0.2, {scale: new Vec3(guideMode.scaleX?guideMode.scaleX:1, 1, 1)}).call(() => {
                        guideIndex++;
                    }).start();
                }


            }
            // 将实例化的预制体添加到场景中
            popup.addChild(guide)
            // // 取消监听
            let background = UIManager.getInstance().maskGlobal.getChildByName('Background');
            UIManager.getInstance().adapterContentSize(background);
            background.off(Node.EventType.TOUCH_START);
            background.on(Node.EventType.TOUCH_START, function (event) {
                UIManager.getInstance().closeMaskGlobal();
                self.resume()
            }, this);
            guide.off(Node.EventType.TOUCH_END);
            guide.on(Node.EventType.TOUCH_END, function (event) {
                if (guideIndex >= self.guides.length) {
                    UIManager.getInstance().closeMaskGlobal();
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
            guide.getParent().getComponent(UITransform).setContentSize(guide.getComponent(UITransform).contentSize)
            // });
        }

    }

}
