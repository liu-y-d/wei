import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node, Toggle,tween,Animation} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {Global, PropsConfig} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {GhostMessage} from "db://assets/Script/GhostState";
import {AudioMgr} from "db://assets/Script/AudioMgr";

export class PropsObstacleReset implements BaseProps {
    description: string = "将所有障碍物随机分布，只在开局时可用";
    id: number = GamePropsEnum.OBSTACLE_RESET;
    name: string = "障碍物重置";
    defaultNum: number = 3;
    spriteFrameUrl = 'reset/spriteFrame'
    target: Node
    isTweening: boolean;


    init() {
        return true;
    }

    setNum(num?: number) {
        this.target.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

    inure() {
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.OBSTACLE_RESET);
        if (Global.getInstance().playerPath.length == 0 && num > 0) {

            let propsConfigById = Global.getInstance().getPropsConfigById(this.id);
            if (propsConfigById.showTip) {
                UIManager.getInstance().showPropsTip(this.description, this.resume);
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
                propsId: GamePropsEnum.OBSTACLE_RESET,
                showTip: !this.getParent().getParent().getChildByName("Toggle").getComponent(Toggle).isChecked
            }
            Global.getInstance().setPropsConfigSingle(config);

        }
        if (Global.getInstance().getSoundEffectState()) {
            AudioMgr.inst.playOneShot('audio/swoosh')
        }
        UIManager.getInstance().closeMaskGlobal();
        Global.getInstance().gameCanvas.getChildByName("Content").getChildByName("DetailPanel").getComponent(Animation).play();
        LevelDesign.getInstance().getShapeManager().createDefaultObstacle();
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.OBSTACLE_RESET);
        num--;
        LevelDesign.getInstance().propsUsableConfig.set(GamePropsEnum.OBSTACLE_RESET, num);
        LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.OBSTACLE_RESET).setNum(num);


    }


}
