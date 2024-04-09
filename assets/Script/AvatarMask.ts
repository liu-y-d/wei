import { _decorator, Component, Node,Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AvatarMask')
export class AvatarMask extends Component {
    start() {

        const g = this.node.getComponent(Graphics);
        //const g = this.mask.graphics;
        g.lineWidth = 10;
        g.roundRect(0, 0, 80, 80,10);
        g.stroke();
        g.fill();
    }

    update(deltaTime: number) {
        
    }
}

