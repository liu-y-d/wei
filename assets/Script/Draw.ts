import { _decorator, Component, Node,Graphics,Prefab,Vec2,Label,EventTouch,UITransform,tween,Vec3 } from 'cc';
import {Shape} from "db://assets/Script/Shape";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Coord, Global} from "db://assets/Script/Global";
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {

    shape:Shape;

    public hasObstacle:boolean = false;

    public isDestination:boolean = false;

    public isMapPropsDirection:boolean = false;

    public mapPropsDirection:Coord;

    @property(Prefab)
    directionProps:Prefab
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
        this.isDestination = false;
        LevelDesign.getInstance().getShapeManager().draw(ctx,shape)
    }

    drawBottom(shape:Shape){
        this.shape = shape;
        var ctx = this.getComponent(Graphics);
        let center = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(shape.x,shape.y));
        this.node.setPosition(center.x,center.y)
        this.isDestination = false;
        this.hasObstacle = false;
        LevelDesign.getInstance().getShapeManager().drawBottom(ctx,shape)
    }

    drawDestination(shape:Shape){
        this.shape = shape;
        var ctx = this.getComponent(Graphics);
        let center = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(shape.x,shape.y));
        this.node.setPosition(center.x,center.y)
        this.isDestination = true;
        this.hasObstacle = false;
        LevelDesign.getInstance().getShapeManager().drawDestination(ctx,shape)
    }



    /**
     * 创建障碍
     */
    creatorObstacle(){
        if (!this.hasObstacle){
            var ctx = this.getComponent(Graphics);
            this.hasObstacle = true;
            this.isDestination = false;
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
        let obstacle = Global.getInstance().tileMap[shape.x][shape.y].getChildByName("Obstacle");
        if (obstacle) {
            obstacle.removeFromParent();
        }
        if (this.isDestination) {
            this.drawDestination(shape);
        }else {
            this.draw(shape);
        }
    }

}

