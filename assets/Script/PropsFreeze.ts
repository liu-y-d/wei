import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
export class PropsFreeze implements BaseProps {
    description: string;
    id: number = GamePropsEnum.FREEZE;
    name: string = "冻结";
    defaultNum: number = 3;
    spriteFrameUrl = 'snowflake/spriteFrame'
    node:Node
    init() {
    }
    setNum(num?:number){
        this.node.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

}