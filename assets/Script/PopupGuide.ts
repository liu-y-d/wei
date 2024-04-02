import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupEnum, UIManager} from "db://assets/Script/UIManager";
import {Node, instantiate, Prefab, UITransform, tween, Toggle, Vec3} from 'cc';
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Popup} from "db://assets/Script/Popup";

export type Guide = { pos: { x: number, y: number }, tip: string, angle?: number }

export class PopupGuide implements PopupBase {
	type: number = PopupEnum.GUIDE;
	guides: Guide[]

	init() {
		let popup = UIManager.getInstance().maskGlobal.getChildByName("Popup");
		popup.removeAllChildren();
		let guide = popup.getChildByName(popup.getComponent(Popup).guide.name)
		popup.scale = new Vec3(1,1,1);
		let component = popup.getComponent(UITransform);
		if (!guide) {
			// 实例化预制体
			guide = instantiate(UIManager.getInstance().maskGlobal.getChildByName("Popup").getComponent(Popup).guide);
			// guide.scale = new Vec3(0,0,1);
			let guideIndex = 0;
			let self = this;

			function showGuide() {
				if (guideIndex < self.guides.length) {
					let guideMode = self.guides[guideIndex];
					if (guideMode.angle) {
						guide.angle = guideMode.angle
						guide.getChildByName("Text").angle = guideMode.angle
					}
					let pos = component.convertToNodeSpaceAR(new Vec3(guideMode.x, guideMode.y,0))
					let tween1 = tween(guide);
					tween1.to(0, {scale: new Vec3(0, 0, 1)});
					if (guideMode.angle) {
						tween1.to(0, {angle: guideMode.angle})
					}
					tween1
						.to(0, {position: pos})
						.to(0.2, {scale: new Vec3(1, 1, 1)}).call(() => {
						console.log(123123)
						guideIndex++;
					}).start();
				}


			}

			// guide.getChildByName("Close").on(Node.EventType.TOUCH_END,()=>{
			//     UIManager.getInstance().closeMaskGlobal();
			// })
			//
			// let music = guide.getChildByName("ToggleGroup").getChildByName('Music')
			// music.getComponent(Toggle).isChecked = Global.getInstance().getMusicState();
			// music.on('toggle', (node)=>{
			//     // 判断下次点击道具是否弹出提示
			//     Global.getInstance().setMusicState(node.isChecked)
			// }, music);
			// let soundEffect = guide.getChildByName("ToggleGroup").getChildByName('SoundEffect');
			// soundEffect.getComponent(Toggle).isChecked = Global.getInstance().getSoundEffectState();
			// soundEffect.on('toggle', (node)=>{
			//     // 判断下次点击道具是否弹出提示
			//     Global.getInstance().setSoundEffectState(node.isChecked)
			// }, soundEffect);
			// let Shake = guide.getChildByName("ToggleGroup").getChildByName('Shake');
			// Shake.getComponent(Toggle).isChecked = Global.getInstance().getShakeState();
			// Shake.on('toggle', (node)=>{
			//     // 判断下次点击道具是否弹出提示
			//     Global.getInstance().setShakeState(node.isChecked)
			// }, Shake);
			// 将实例化的预制体添加到场景中
			popup.addChild(guide)
			// // 取消监听
			let background = UIManager.getInstance().maskGlobal.getChildByName('Background');
			UIManager.getInstance().adapterContentSize(background);
			background.off(Node.EventType.TOUCH_START);
			background.on(Node.EventType.TOUCH_START, function (event) {

			}, background);
			guide.off(Node.EventType.TOUCH_END);
			guide.on(Node.EventType.TOUCH_END, function (event) {
				showGuide();
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
