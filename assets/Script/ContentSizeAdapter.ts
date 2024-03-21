import { _decorator, Component, Node,screen,UITransform,Vec3 } from 'cc';
import {UIManager} from "db://assets/Script/UIManager";
const { ccclass, property } = _decorator;

@ccclass('ContentSizeAdapter')
export class ContentSizeAdapter extends Component {
    start() {

    }
    onLoad() {
       UIManager.getInstance().adapterContentSize(this.node)
    }

    update(deltaTime: number) {
        
    }
}

