import { _decorator, Component, Node,Graphics,UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AvatarMask')
export class AvatarMask extends Component {
    start() {

        const g = this.node.getComponent(Graphics);
        let width = this.node.getComponent(UITransform).contentSize.width/2;
        //const g = this.mask.graphics;
        g.lineWidth = 1;
        g.roundRect(-width, -width, 50, 50,10);
        g.stroke();
        g.fill();
    }

    update(deltaTime: number) {
        
    }
}

