import {Vec3,_decorator, Component, Node, Graphics, Label, color,UITransform} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('PropsNum')
export class PropsNum extends Component {
    labelNum: Label;
    dotRadius: 50;


    onStart() {
        this.initGraphics();
    }

    initGraphics() {
        // if (!this.node.getComponent(Graphics)) {
        //     this.addComponent(Graphics);
        // }

        this.drawRedDot(); // 绘制红色小圆
    }

    drawRedDot() {
        let spriteSize = this.node.getComponent(UITransform).contentSize;
        let ctx = this.node.getComponent(Graphics);
        ctx.clear();
        ctx.fillColor.fromHEX("#FF0000");
        this.node.getComponent(UITransform).convertToNodeSpaceAR(this.node.getWorldPosition())
        // ctx.circle(this.node.getPosition().x + spriteSize.width/2, this.node.getPosition().y + spriteSize.height/2, this.dotRadius);
        // ctx.circle(spriteSize.width/2, spriteSize.height/2, this.dotRadius);
        ctx.circle(this.node.getPosition().x + spriteSize.width/2, this.node.getPosition().y - spriteSize.height/2, 20);
        // ctx.circle(200,200, 200);
        // ctx.circle(0, 0, this.dotRadius);
        ctx.stroke();
        ctx.fill();
    }
    setNum(num?:number) {
        let spriteSize = this.node.getComponent(UITransform).contentSize;
        let childByName = this.node.getChildByName("propsNumLabel");
        childByName.getComponent(Label).string = num.toString();
        childByName.setPosition(spriteSize.width/2,-spriteSize.height/2)
    }
    // addNum() {
    //     if (!this.labelNum) {
    //         this.labelNum = new Label();
    //         this.node.addChild(this.labelNum);
    //     }
    //
    //     let spriteSize = this.node.getContentSize();
    //     let halfDotRadius = this.dotRadius / 2;
    //
    //     // 设置Label位置在小圆中心
    //     this.labelNode.setPosition(spriteSize.width - halfDotRadius, halfDotRadius);
    // }
}

