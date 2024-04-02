import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node, Toggle, Sprite, Vec3,tween,UITransform,instantiate} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {Global, PropsConfig} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {GhostMessage} from "db://assets/Script/GhostState";
import {PrefabController} from "db://assets/Script/PrefabController";
import {AudioMgr} from "db://assets/Script/AudioMgr";

export class PropsFreeze implements BaseProps {
    description: string = "当前回合中，限制对手移动";
    id: number = GamePropsEnum.FREEZE;
    name: string = "冻结";
    defaultNum: number = 3;
    spriteFrameUrl = 'snowflake/spriteFrame'
    target: Node
    isTweening:boolean

    init() {
        return true;
    }

    setNum(num?: number) {
        this.target.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

    inure() {
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.FREEZE);
        if (num > 0) {
            let propsConfigById = Global.getInstance().getPropsConfigById(this.id);
            if (propsConfigById.showTip) {
                UIManager.getInstance().showPropsTip(this.name,this.description, this.resume);
            } else {
                this.resume()
            }
        }else {
            if (!this.isTweening) {
                this.isTweening = true;
                let self = this;
                let angle = 20;
                tween(this.target.getChildByName("icon"))
                    .to(0.1,{angle: -angle})
                    .to(0.1,{angle:angle})
                    .to(0.1,{angle:0})
                    .call(()=>{
                        self.isTweening = false;
                    })
                    .start();
            }

        }
    }

    resume() {
        if (this instanceof Node && this.name == "Continue") {
            let config: PropsConfig = {
                propsId: GamePropsEnum.FREEZE,
                showTip: !this.getParent().getParent().getChildByName("Toggle").getComponent(Toggle).isChecked
            }
            Global.getInstance().setPropsConfigSingle(config);

        }
        Global.getInstance().moveLock.active = true;
        UIManager.getInstance().closeMaskGlobal();
        let playArea = Global.getInstance().playArea;
        let propsTarget = LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.FREEZE).target;
        let startPosition = propsTarget.getComponent(UITransform).convertToWorldSpaceAR(propsTarget.getPosition());
        startPosition.x = startPosition.x-propsTarget.getPosition().x;
        startPosition = playArea.getComponent(UITransform).convertToNodeSpaceAR(startPosition);

        let ghost = Global.getInstance().playArea.getChildByName('Ghost');
        let endPosition = ghost.getPosition();
        let emit = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).propsEmit);
        emit.setSiblingIndex(999999999999)
        playArea.addChild(emit);
        emit.setPosition(startPosition)

        if (Global.getInstance().getSoundEffectState()) {
            AudioMgr.inst.playOneShot('audio/freeze')
        }
        tween(emit).to(0.5,{position:endPosition}).call(()=>{
            emit.destroy();
            tween(ghost)
                .to(0.1,{angle: -20})
                .to(0.1,{angle:20})
                .to(0.1,{angle:0})
                // .call(()=>{
                //     self.isTweening = false;
                // })
                .start();
            ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.freeze)
            let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.FREEZE);
            num--;
            LevelDesign.getInstance().propsUsableConfig.set(GamePropsEnum.FREEZE, num);
            LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.FREEZE).setNum(num);
            Global.getInstance().moveLock.active = false;
        }).start()

    }

}
