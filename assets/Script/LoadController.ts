import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;
import { director } from "cc";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
@ccclass('LoadController')
export class LoadController extends Component {
    start() {
        ProcessStateMachineManager.getInstance().init();
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.load);

    }

    update(deltaTime: number) {
        
    }
}

