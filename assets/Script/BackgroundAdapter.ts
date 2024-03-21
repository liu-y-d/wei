import { _decorator, Component, Node,screen,UITransform,Vec3 } from 'cc';
import {UIManager} from "db://assets/Script/UIManager";
const { ccclass, property } = _decorator;

@ccclass('BackgroundAdapter')
export class BackgroundAdapter extends Component {
    start() {

    }
    onLoad() {
        UIManager.getInstance().adapterScale(this.node)
    }

    update(deltaTime: number) {
        
    }
}

