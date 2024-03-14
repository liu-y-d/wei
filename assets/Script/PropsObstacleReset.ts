import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node, Toggle} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {Global, PropsConfig} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {GhostMessage} from "db://assets/Script/GhostState";

export class PropsObstacleReset implements BaseProps {
    description: string = "将所有障碍物随机分布，只在开局时可用";
    id: number = GamePropsEnum.OBSTACLE_RESET;
    name: string = "障碍物重置";
    defaultNum: number = 3;
    spriteFrameUrl = 'reset/spriteFrame'
    target: Node

    init() {
        return true;
    }

    setNum(num?: number) {
        this.target.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

    inure() {
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.OBSTACLE_RESET);
        console.log(Global.getInstance().playerPath.length)
        if (Global.getInstance().playerPath.length == 0 && num > 0) {

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
                propsId: GamePropsEnum.OBSTACLE_RESET,
                showTip: !this.getParent().getParent().getChildByName("Toggle").getComponent(Toggle).isChecked
            }
            Global.getInstance().setPropsConfigSingle(config);

        }
        UIManager.getInstance().closeMaskGlobal();

        LevelDesign.getInstance().getShapeManager().createDefaultObstacle();
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.OBSTACLE_RESET);
        num--;
        LevelDesign.getInstance().propsUsableConfig.set(GamePropsEnum.OBSTACLE_RESET, num);
        LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.OBSTACLE_RESET).setNum(num);


    }

}