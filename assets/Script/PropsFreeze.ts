import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node, Toggle, Sprite, Color} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {Global, PropsConfig} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {GhostMessage} from "db://assets/Script/GhostState";

export class PropsFreeze implements BaseProps {
    description: string = "当前回合中，限制对手移动";
    id: number = GamePropsEnum.FREEZE;
    name: string = "冻结";
    defaultNum: number = 3;
    spriteFrameUrl = 'snowflake/spriteFrame'
    target: Node

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
                UIManager.getInstance().showPropsTip(this.description, this.resume);
            } else {
                this.resume()
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
        UIManager.getInstance().closeMaskGlobal();

        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.freeze)
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.FREEZE);
        num--;
        LevelDesign.getInstance().propsUsableConfig.set(GamePropsEnum.FREEZE, num);
        LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.FREEZE).setNum(num);
    }

}