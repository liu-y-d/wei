import { _decorator,Label, Component, Node,Button,find,instantiate,director,Vec2,Tween,Vec3,UITransform } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('BulletNode')
export class BulletNode extends Component {

    public speed: number = 50; // 可视情况调整
    onLoad() {
        this.node.active = false; // 初始化时隐藏节点，待用时显示
    }

    startScrolling(text: string, containerWidth: number, y:number) {
        this.node.getComponent(Label).string = text;
        this.node.getComponent(Label).getComponent(UITransform).height;
        this.node.setPosition(-360, y); // 假设从屏幕左侧滚入
        this.node.active = true;

        const duration = containerWidth / this.speed;
        let tween =  new Tween(this.node);
        console.log(this.node)
        tween.to(duration, { position: new Vec3(containerWidth/2 + this.node.getComponent(UITransform).contentSize.width, y,0) })
            .call(()=>{
                this.node.active = false;
            })
            .start();
    }
}