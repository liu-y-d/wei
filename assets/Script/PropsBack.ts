import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node, Toggle, Graphics, Vec2} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {GameStateEnum, Global, PropsConfig} from "db://assets/Script/Global";
import {Draw} from "db://assets/Script/Draw";
import {ShapeEnum} from "db://assets/Script/ShapeManager";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {GhostMessage} from "db://assets/Script/GhostState";

export class PropsBack implements BaseProps {
    description: string = "返回上一步";
    id: number = GamePropsEnum.BACK;
    name: string = "后退";
    defaultNum: number = 3;
    spriteFrameUrl = 'back/spriteFrame'
    target: Node

    init() {
        return true;
    }

    setNum(num?: number) {

        this.target.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

    inure() {
        let prevCoord = Global.getInstance().playerPath.length;
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.BACK);
        if (prevCoord > 0 && num > 0) {
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
                propsId: GamePropsEnum.BACK,
                showTip: !this.getParent().getParent().getChildByName("Toggle").getComponent(Toggle).isChecked
            }
            Global.getInstance().setPropsConfigSingle(config);

        }
        UIManager.getInstance().closeMaskGlobal();
        let prevCoord = Global.getInstance().playerPath.pop();
        if (prevCoord) {
            Global.getInstance().tileMap[prevCoord.x][prevCoord.y].getComponent(Draw).clearObstacle({
                x: prevCoord.x,
                y: prevCoord.y,
                shape: LevelDesign.getInstance().currentShapeEnum
            });
            if (Global.getInstance().ghostPath.length >= 1) {
                Global.getInstance().currentGhostVec2.x = Global.getInstance().prevGhostVec2.x;
                Global.getInstance().currentGhostVec2.y = Global.getInstance().prevGhostVec2.y;

                Global.getInstance().ghostPath.pop();
                let prev = Global.getInstance().ghostPath[Global.getInstance().ghostPath.length - 1];
                if (!prev) {
                    prev = LevelDesign.getInstance().getShapeManager().center;
                }
                Global.getInstance().prevGhostVec2.x = prev.x;
                Global.getInstance().prevGhostVec2.y = prev.y;
                // Global.getInstance().ghostMoving = true;
                ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost,GhostMessage.back)

            }else {

                Global.getInstance().prevGhostVec2 = LevelDesign.getInstance().getShapeManager().center;
                Global.getInstance().currentGhostVec2 = LevelDesign.getInstance().getShapeManager().center;
                // Global.getInstance().ghostMoving = true;
                ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost,GhostMessage.back)
            }
            let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.BACK);
            num--;
            LevelDesign.getInstance().propsUsableConfig.set(GamePropsEnum.BACK,num)
            LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.BACK).setNum(num)
        }
    }

}