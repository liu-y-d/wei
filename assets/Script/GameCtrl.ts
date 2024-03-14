import { _decorator, Component, Node,Prefab,director } from 'cc';
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
        if (director.getScene().name == 'Game') {
            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game);
        }
        if (director.getScene().name == 'Main') {
            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main);
        }
    }

    update(deltaTime: number) {
        
    }
}

