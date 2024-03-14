import { _decorator, Component, Node,Button,find,instantiate,director } from 'cc';
import {PrefabController} from "db://assets/Script/PrefabController";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
const { ccclass, property } = _decorator;

@ccclass('ButtonsController')
export class ButtonsController extends Component {

    @property(Node)
    private RankBtn:Node = null;

    @property(Node)
    private CreateCustomBtn: Node = null;

    onLoad() {

        // this.RankBtn.on('touchend', RankController.show, this);
        this.RankBtn.on(Button.EventType.CLICK, this.rankOnClick, this);
        this.CreateCustomBtn.on(Button.EventType.CLICK, this.begin, this);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }

    rankOnClick() {
        let canvas = find('Canvas');
        canvas.addChild(instantiate(canvas.getComponent(PrefabController).rankPrefab));
    }
    begin() {
        director.loadScene("Game",()=>{
            // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game)
        });
    }
}

