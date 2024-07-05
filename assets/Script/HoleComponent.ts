import { _decorator, Component, Node,ParticleSystem2D,tween,Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HoleComponent')
export class HoleComponent extends Component {
    isRotate = false;

    // start() {
    //     this.scheduleOnce(()=>{this.node.getChildByName("Particle2D").getComponent(ParticleSystem2D).resetSystem();},1)
    // }

    beginRate(callBack:Function){
        this.isRotate = true;
        this.node.getChildByName("Particle2D").getComponent(ParticleSystem2D).resetSystem()
        tween(this.node).to(2,{ scale:new Vec3(1,1,1)}).call(()=>{
            callBack()
        }).start()
    }

    update(deltaTime: number) {
        if (this.isRotate) {
            if (this.node.getChildByName("Particle2D").getComponent(ParticleSystem2D).startRadius < 250) {
                this.node.getChildByName("Particle2D").getComponent(ParticleSystem2D).startRadius += 5
            }
            this.node.angle = (this.node.angle + 150 * deltaTime) % 360;
        }
    }
}

