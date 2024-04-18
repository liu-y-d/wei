import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, UITransform, tween, RichText, Vec3,Graphics} from 'cc';
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";

export type Guide = { pos: { x: number, y: number }, tip: string, angle?: number,scaleX?:number,draw?:Function }

export class PopupGuide implements PopupBase {
	type: number = PopupEnum.GUIDE;
	guides: Guide[]

	init() {
		let popup = UIManager.getInstance().maskGuideGlobal.getChildByName("Popup");
		popup.removeAllChildren();
		let guide = popup.getChildByName(popup.getComponent(Popup).guide.name)
		popup.scale = new Vec3(1,1,1);
		let component = popup.getComponent(UITransform);
		if (!guide) {
			// 实例化预制体
			guide = instantiate(UIManager.getInstance().maskGuideGlobal.getChildByName("Popup").getComponent(Popup).guide);
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
					let gra = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(Graphics);

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
						if (guideMode.draw) {
							guideMode.draw(gra)
						}
					}).start();
				}


			}
			// 将实例化的预制体添加到场景中
			popup.addChild(guide)
			// // 取消监听
			let background = UIManager.getInstance().maskGuideGlobal.getChildByPath('Mask/Background');
			UIManager.getInstance().adapterContentSize(background);
			background.off(Node.EventType.TOUCH_START);
			background.on(Node.EventType.TOUCH_START, function (event) {

			}, background);
			guide.off(Node.EventType.TOUCH_END);
			guide.on(Node.EventType.TOUCH_END, function (event) {
				if (guideIndex >= self.guides.length) {
					UIManager.getInstance().closeMaskGuideGlobal();
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
