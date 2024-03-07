import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
export class PropsBack implements BaseProps {
    description: string;
    id: number = GamePropsEnum.BACK;
    name: string = "后退";
    defaultNum: number = 3;
    spriteFrameUrl = 'back/spriteFrame'
    node:Node
    init() {
    }

    setNum(num?:number) {

        this.node.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

}