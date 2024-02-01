import { _decorator, Component,Graphics,UITransform, Node ,Vec2} from 'cc';
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
//     draw() {
//         let ctx = this.node.getComponent(Graphics);
//         ctx.clear();
//         let baseLength = this.node.getComponent(UITransform).contentSize.x; // 或者你想要的任意底边长度
//         console.log(baseLength)
//
// // 计算相关坐标
//         let halfBase = baseLength / 2;
//         let height = halfBase / Math.tan(40 * Math.PI / 180);
//
//
//         ctx.moveTo(-halfBase, height);
//         ctx.lineTo(halfBase, height);
//         ctx.lineTo(0, 0); // 注意这个线段会自动闭合形成三角形
//         ctx.stroke();
//         //4边
//         ctx.fillColor.fromHEX("#aaaaaa")
//         ctx.fill();
//     }
}

