import { _decorator, Component, Node,Prefab } from 'cc';
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {


    public xNum=11;

    @property(Prefab)
    public tile:Prefab;
    onLoad() {
        ProcessStateMachineManager.getInstance().init();

    }
    start() {
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game);
    }

    update(deltaTime: number) {
        
    }
}

