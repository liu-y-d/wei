import { _decorator, Component, Node,Graphics,Vec2,Label,EventTouch,UITransform,tween,Vec3 } from 'cc';
import {Shape} from "db://assets/Script/Shape";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Global} from "db://assets/Script/Global";
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {

    shape:Shape;

    public hasObstacle:boolean = false;
    onLoad() {

    }
    start() {

    }



    update(deltaTime: number) {
        
    }
    draw(shape:Shape){
        this.shape = shape;
        var ctx = this.getComponent(Graphics);
        let center = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(shape.x,shape.y));
        this.node.setPosition(center.x,center.y)
        LevelDesign.getInstance().getShapeManager().draw(ctx,shape)
    }



    /**
     * 创建障碍
     */
    creatorObstacle(){
        if (!this.hasObstacle){

            this.hasObstacle = true;
            var ctx = this.getComponent(Graphics);
            LevelDesign.getInstance().getShapeManager().creatorObstacle(ctx,this.shape)

        }
    }
    initObstacleEmit() {

    }
    /**
     * 创建障碍
     */
    creatorObstacleHasAnimation(){
        if (!this.hasObstacle){
            // console.log(this.emit)
            this.hasObstacle = true;
            var ctx = this.getComponent(Graphics);
            LevelDesign.getInstance().getShapeManager().creatorObstacle(ctx,this.shape)
            Global.getInstance().moveLock.active = false;
        }
    }

    clearObstacle(shape:Shape){
        this.hasObstacle = false;
        this.draw(shape);
    }

}

