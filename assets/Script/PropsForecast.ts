import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node, Toggle, Vec2, Vec3} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {Global, PropsConfig} from "db://assets/Script/Global";
import {Draw} from "db://assets/Script/Draw";
import {LevelDesign} from "db://assets/Script/LevelDesign";

export class PropsForecast implements BaseProps {
    description: string = "预示对手即将前往的目标点";
    id: number = GamePropsEnum.FORECAST;
    name: string = "预测";
    defaultNum: number = 3;
    spriteFrameUrl = 'location/spriteFrame'
    target: Node

    init() {
        // 如果关卡默认显示移动方向则删掉这个道具
        return !LevelDesign.getInstance().showGhostDirection;
    }

    setNum(num?: number) {
        this.target.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

    inure() {
        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.FORECAST);
        let point1 = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(Global.getInstance().predictCoord.x, Global.getInstance().predictCoord.y))

        if (num > 0 && !Global.getInstance().playArea.getChildByName("Direct").getPosition().equals(new Vec3(point1.x, point1.y, 0))) {
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
                propsId: GamePropsEnum.FORECAST,
                showTip: !this.getParent().getParent().getChildByName("Toggle").getComponent(Toggle).isChecked
            }
            Global.getInstance().setPropsConfigSingle(config);

        }
        UIManager.getInstance().closeMaskGlobal();


        LevelDesign.getInstance().getShapeManager().direct(Global.getInstance().predictCoord,0.5);

        let num = LevelDesign.getInstance().propsUsableConfig.get(GamePropsEnum.FORECAST);
        num--;
        LevelDesign.getInstance().propsUsableConfig.set(GamePropsEnum.FORECAST, num)
        LevelDesign.getInstance().levelPropsArray.get(GamePropsEnum.FORECAST).setNum(num)
    }


}