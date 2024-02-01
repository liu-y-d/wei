import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Coord, GameStateEnum, Global} from "db://assets/Script/Global";
import {misc} from "cc";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Draw} from "db://assets/Script/Draw";
import {Shape} from "db://assets/Script/Shape";
import {Ghost} from "db://assets/Script/Ghost";
import {UIManager} from "db://assets/Script/UIManager";

export class GhostState implements IProcessStateNode {
    readonly key = ProcessStateEnum.ghost;
    
    

    public unitSet:number[] = [0,1,-1]

    _listener: { [code: string]: (target,params)=>void | null } = {}

    public ghostNode;

    onExit() {
    }

    onHandlerMessage(code:string,params) {
        this._listener[code](this,params);

        // Global.getInstance().ghostMoving = false;
    }

    onInit() {
        this._listener[GhostMessage.move] = this.move;
        this.ghostNode = Global.getInstance().playArea.getChildByName('Ghost');
        this.ghostNode.setSiblingIndex(9999);
        // this.ghostNode.getComponent(UITransform).setContentSize(LevelDesign.getInstance().getShapeManager().shapeWidth,LevelDesign.getInstance().getShapeManager().shapeWidth)
        Global.getInstance().currentGhostVec2 = LevelDesign.getInstance().getShapeManager().center;
        Global.getInstance().prevGhostVec2 = Global.getInstance().currentGhostVec2;
        let point = LevelDesign.getInstance().getShapeManager().getCenter(Global.getInstance().currentGhostVec2);
        this.ghostNode.setPosition(point.x,point.y)
        // this.ghostNode.getComponent(Ghost).draw();

        // if (LevelDesign.getInstance().showGhostDirection) {
            // 如果显示下一步行进方向 则需要提前计算好方向
            let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

            let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x,Global.getInstance().currentGhostVec2.y);

            if (randomIndex == -1) {
                this.win();
                return;
            }
            Global.getInstance().predictCoord = {x:nearHexagonCoords[randomIndex].x,y:nearHexagonCoords[randomIndex].y}

            if (LevelDesign.getInstance().showGhostDirection) {
                this.setDirectPosition()
            }
            // // 计算朝向角度
            // // 注意：在二维空间内，如果正右方向为0度，则此计算方法有效；若正上方为0度，请相应调整。
            // let angle = Math.atan2(this.predictCoord.x - this.ghostNode.getPosition().x, this.predictCoord.y - this.ghostNode.getPosition().y);
            // angle = misc.radiansToDegrees(angle); // 将弧度转换为角度
            // // 考虑到Cocos Creator的rotation是顺时针为正，因此需要取反角度值以使右侧为0度
            // this.ghostNode.angle = -angle;
        // }
    }
    setDirectPosition() {
        LevelDesign.getInstance().getShapeManager().direct(Global.getInstance().predictCoord);
    }
    onUpdate(deltaTime,target) {
        if (Global.getInstance().ghostMoving) {
            let point = LevelDesign.getInstance().getShapeManager().getCenter(Global.getInstance().currentGhostVec2);
            if (point.x == target.node.getPosition().x && point.y == target.node.getPosition().y) {
                Global.getInstance().ghostMoving = false;
                return;
            }
            Global.getInstance().tileMap[Global.getInstance().currentGhostVec2.x][Global.getInstance().currentGhostVec2.y].getComponent(Draw).draw(new Shape(Global.getInstance().currentGhostVec2.x,Global.getInstance().currentGhostVec2.y));
            let originalX = target.node.getPosition().x;
            let originalY = target.node.getPosition().y;
            this.ghostNode.setPosition(point.x,point.y)
            // 计算朝向角度
            // 注意：在二维空间内，如果正右方向为0度，则此计算方法有效；若正上方为0度，请相应调整。
            let angle = Math.atan2(target.node.getPosition().x - originalX, target.node.getPosition().y - originalY);
            angle = misc.radiansToDegrees(angle); // 将弧度转换为角度
            // 考虑到Cocos Creator的rotation是顺时针为正，因此需要取反角度值以使右侧为0度
            target.node.angle = -angle;

            if(LevelDesign.getInstance().getShapeManager().isEdge(Global.getInstance().currentGhostVec2)) {
                this.lose();
                return;
            }
            let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

            let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x,Global.getInstance().currentGhostVec2.y);
            if (randomIndex == -1) {
                this.win();
                return;
            }
            Global.getInstance().predictCoord = {x:nearHexagonCoords[randomIndex].x,y:nearHexagonCoords[randomIndex].y}
            if (LevelDesign.getInstance().showGhostDirection) {
                this.setDirectPosition()
            }
        }
    }

    move(target,params: any[]) {
        let x,y;
        // 移动时如果 下一步位置被占用了则重新计算并移动
        if (Global.getInstance().predictCoord && Global.getInstance().tileMap[Global.getInstance().predictCoord.x][Global.getInstance().predictCoord.y].getComponent(Draw).hasObstacle) {
            let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

            let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x,Global.getInstance().currentGhostVec2.y);
            if (randomIndex == -1) {
                target.win();
                return;
            }
            x = nearHexagonCoords[randomIndex].x;
            y = nearHexagonCoords[randomIndex].y;
        }else {
            x = Global.getInstance().predictCoord.x;
            y = Global.getInstance().predictCoord.y;
        }

        if (!(Global.getInstance().currentGhostVec2.x == Global.getInstance().prevGhostVec2.x && Global.getInstance().currentGhostVec2.y == Global.getInstance().prevGhostVec2.y)) {
            Global.getInstance().prevGhostVec2.set(Global.getInstance().currentGhostVec2);
        }
        Global.getInstance().currentGhostVec2.set(x,y);
        Global.getInstance().ghostMoving = true;

    }
    win() {
        console.log("你赢了")
        UIManager.getInstance().gameOver(GameStateEnum.win);
    }
    lose() {
        console.log("你输了")
        UIManager.getInstance().gameOver(GameStateEnum.lose);

    }

}
export enum GhostMessage{
    move="move",
    win="win",
    lose="lose",
}