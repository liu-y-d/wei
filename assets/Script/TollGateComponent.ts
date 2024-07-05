import { _decorator, Component, Node,instantiate,Vec3,Layout,find,tween,Sprite,Color,Button,Label,Widget } from 'cc';
import {PrefabController} from "db://assets/Script/PrefabController";
import {Global} from "db://assets/Script/Global";
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";
import {ButtonsController} from "db://assets/Script/ButtonsController";
import {HoleComponent} from "db://assets/Script/HoleComponent";
const { ccclass, property } = _decorator;

@ccclass('TollGateComponent')
export class TollGateComponent extends Component {
    start() {

    }

    onLoad() {
        // this.initTollGate(62);

    }

    update(deltaTime: number) {
        
    }

    initTollGate(level){
        // let level = Global.getInstance().getPlayerInfo().gameLevel
        // let level = 60

        let canvas = find('Canvas');

        canvas.getChildByPath("Content/MainHole").getComponent(HoleComponent).beginRate(()=>{});
        this.scheduleOnce(()=>{this.initBlock(level,canvas)},0.5)

        // }

        // }
    }
    initBlock(level,canvas) {
        let count = 1;
        let shakeTweens = [];
        for (let i = level + 5; i > level; i--) {
            let difficultyLevel = LevelDesign.getInstance().calculateDifficultyLevel(i);
            let prefab;
            switch (difficultyLevel) {
                case DifficultyLevelEnum.Easy:
                    prefab = canvas.getComponent(PrefabController).mainTollgate4
                    break;
                case DifficultyLevelEnum.Medium:
                    prefab = canvas.getComponent(PrefabController).mainTollgate6
                    break;
                case DifficultyLevelEnum.Hard:
                    prefab = canvas.getComponent(PrefabController).mainTollgate8
                    break;
            }
            let initScale = this.customFibonacci(count++);
            let node = instantiate(prefab);
            if (count != 6) {
                node.getChildByName("Begin").active = false;
                node.getChildByName('LevelFnt').getComponent(Widget).top = 0.15
                node.getChildByName('LevelFnt').getComponent(Widget).isAbsoluteTop = false
                node.getChildByName('Level').active = false;
                node.getChildByName('LevelFnt').getComponent(Label).string = i

            }else {
                node.getChildByName('LevelFnt').getComponent(Label).string = "第"+i+"关"

            }
            node.scale = new Vec3(initScale, initScale, 1);
            let level = node.getChildByName('Level');
            let color = new Color();

            switch (difficultyLevel) {
                case DifficultyLevelEnum.Easy:
                    level.getComponent(Sprite).color = Color.fromHEX(color, "#88e9c1")
                    level.getChildByName('DifficultyFnt').getComponent(Label).string = '简单'
                    break;
                case DifficultyLevelEnum.Medium:
                    level.getComponent(Sprite).color = Color.fromHEX(color, "#768ff2")
                    level.getChildByName('DifficultyFnt').getComponent(Label).string = '中等'
                    break;
                case DifficultyLevelEnum.Hard:
                    level.getComponent(Sprite).color = Color.fromHEX(color, "#F863F2")
                    level.getChildByName('DifficultyFnt').getComponent(Label).string = '困难'
                    break;
            }
            // let shake = tween(node);
            shakeTweens.push(node)
            this.node.addChild(node)

        }
        let layout = this.node.addComponent(Layout);
        layout.type = 2
        layout.affectedByScale = true
        layout.spacingY = 20
        layout.updateLayout();
        for (let shakeTween of shakeTweens) {
            shakeTween.active =false
        }
        let index = 0;
        // while (index < shakeTweens.length) {
        // while (index == shakeTweens.length){
        //     console.log(index)
        let duration = 0.1;
        // --index;
        shakeTweens[index].active =true
        tween(shakeTweens[index])
            // .delay(0.5)
            .to(duration, {position: new Vec3(shakeTweens[index].getPosition().x, shakeTweens[index].getPosition().y + 10, 0)}
                //     , {                        // to 接口表示节点的绝对值
                //     onUpdate: (target: Vec3, ratio: number) => {                        // 实现 ITweenOption 的 onUpdate 回调，接受当前缓动的进度
                //         this.node.position = target;                                 // 将缓动系统计算出的结果赋予 node 的位置
                //     }
                // }
            )
            .to(duration, {position: new Vec3(shakeTweens[index].getPosition().x, shakeTweens[index].getPosition().y, 0)}
                //     , {                        // to 接口表示节点的绝对值
                //     onUpdate: (target: Vec3, ratio: number) => {                        // 实现 ITweenOption 的 onUpdate 回调，接受当前缓动的进度
                //         this.node.position = target;                                 // 将缓动系统计算出的结果赋予 node 的位置
                //     }
                // }
            )

            .call(() => {
                let shakeTween = shakeTweens[++index];
                shakeTween.active =true
                tween(shakeTween)
                    .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y + 20, 0)})
                    .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y, 0)})
                    .call(() => {
                        let shakeTween = shakeTweens[++index];
                        shakeTween.active =true
                        tween(shakeTween)
                            .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y + 30, 0)})
                            .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y, 0)})
                            .call(() => {
                                let shakeTween = shakeTweens[++index];
                                shakeTween.active =true
                                tween(shakeTween)
                                    .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y + 50, 0)})
                                    .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y, 0)})
                                    .call(() => {
                                        let shakeTween = shakeTweens[++index];
                                        shakeTween.active =true
                                        tween(shakeTween)
                                            .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y + 80, 0)})
                                            .to(duration, {position: new Vec3(shakeTween.getPosition().x, shakeTween.getPosition().y, 0)}).call(() => {
                                            // index = shakeTweens.length - 1;
                                            // let shakeTween = shakeTweens[index];
                                            let color = new Color();
                                            shakeTween.getComponent(Sprite).color = Color.fromHEX(color, "#7FFF00")
                                            let level = shakeTween.getChildByName('Level');
                                            // level.setPosition(level.getPosition().x, level.getPosition().y + 50);
                                            level.active = true;
                                            // level.scale = new Vec3(0,0,1)
                                            // this.scheduleOnce(()=>{
                                            //     // tween(level).to(0.5, {position: new Vec3(level.getPosition().x, level.getPosition().y - 50, 0)}).start();
                                            //     tween(level).to(0.5, {scale: new Vec3(1, 1, 1)},{onUpdate:(target,abc)=>{
                                            //         console.log(target)
                                            //         console.log(abc)
                                            //         }}).start();
                                            // },0.5)
                                            let button = shakeTween.addComponent(Button);
                                            button.transition = Button.Transition.SCALE;
                                            button.zoomScale = 1.2
                                            button.duration = 0.1
                                            let buttonsController = canvas.getChildByPath("Content/Buttons").getComponent(ButtonsController);
                                            shakeTween.on(Button.EventType.CLICK, buttonsController.begin, buttonsController);
                                        }).start()
                                    }).start()
                            }).start()
                    }).start()
            }).start()
    }
    customFibonacci(n) {
        // 自定义起始值
        if (n === 1) return 0.2;
        if (n === 2) return 0.3;

        // 初始化前两项
        let prevPrev = 0.2; // 相当于传统斐波那契中的第0项
        let prev = 0.3;     // 相当于传统斐波那契中的第1项
        let current;

        // 从第三项开始计算
        for (let i = 3; i <= n; i++) {
            current = prevPrev + prev;
            prevPrev = prev;
            prev = current;
        }

        return current;
    }
}

