import { _decorator,Label, Component, Node,Button,find,instantiate,director,Vec2,Tween,Vec3,UITransform } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('BulletNode')
export class BulletNode extends Component {

    public speed: number = 50; // 可视情况调整
    onLoad() {
        // this.node.active = false; // 初始化时隐藏节点，待用时显示
    }

    startScrolling(text: string, containerWidth: number,callback:Function) {
        // this.node.getComponent(Label).string = text;
        // this.node.setPosition(-360, y); // 假设从屏幕左侧滚入
        this.node.active = true;
        // console.log(y)
        let duration = (containerWidth + this.node.getComponent(UITransform).contentSize.width)  / this.speed;
        let tween =  new Tween(this.node);
        // console.log(containerWidth/2 + this.node.getComponent(UITransform).contentSize.width)
        // console.log(duration)
        tween.to(duration, { position: new Vec3(containerWidth/2 + this.node.getComponent(UITransform).contentSize.width, this.node.getPosition().y,0) })
            .call(()=>{
                // console.log(this.node.uuid)
                this.node.active = false;
                this.node.setPosition(-360, this.node.getPosition().y);
                callback();
            })
            .start();
    }
}