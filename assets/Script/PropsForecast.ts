import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
export class PropsForecast implements BaseProps {
    description: string;
    id: number = GamePropsEnum.FORECAST;
    name: string = "预测";
    defaultNum: number = 3;
    spriteFrameUrl='location/spriteFrame'
    node:Node
    init() {
    }

    setNum(num?:number) {
        this.node.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

}