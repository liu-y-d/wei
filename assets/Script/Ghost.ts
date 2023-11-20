import { _decorator, Component, Node ,Vec2} from 'cc';
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
const { ccclass, property } = _decorator;

@ccclass('Ghost')
export class Ghost extends Component {



    onLoad() {

    }
    start() {

    }
    update(deltaTime: number) {
        ProcessStateMachineManager.getInstance().updateByKey(ProcessStateEnum.ghost,deltaTime,this);
    }
}

