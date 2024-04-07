import { _decorator, Component, Node,tween,Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScheduleAdapter')
export class ScheduleAdapter extends Component {
    start() {
        let Detail = this.node.getChildByName("Detail");
        let DetailTip = this.node.getChildByName("DetailTip");
        let toggleChildSequentially = function () {
            if (Detail.scale.x == 1){
                tween(Detail)
                    .to(0.2,{scale:new Vec3(0,0,1)})
                    .call(()=>{
                        tween(DetailTip)
                            .to(0.2,{scale:new Vec3(1,1,1)})
                            .start();
                    }).start();
            }else {
                tween(DetailTip)
                    .to(0.2,{scale:new Vec3(0,0,1)})
                    .call(()=>{
                        tween(Detail)
                            .to(0.2,{scale:new Vec3(1,1,1)})
                            .start();
                    }).start();
            }
        }
        this.schedule(toggleChildSequentially,10)
    }

    update(deltaTime: number) {

    }
}


