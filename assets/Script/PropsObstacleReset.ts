import {BaseProps, GamePropsEnum} from "db://assets/Script/BaseProps";
import {Node} from 'cc';
import {PropsNum} from "db://assets/Script/PropsNum";
export class PropsObstacleReset implements BaseProps {
    description: string;
    id: number = GamePropsEnum.OBSTACLE_RESET;
    name: string = "障碍物重置";
    defaultNum: number = 3;
    spriteFrameUrl = 'reset/spriteFrame'
    node:Node
    init() {
    }

    setNum(num?:number) {
        this.node.getChildByName("propsNum").getComponent(PropsNum).setNum(num);
    }

}