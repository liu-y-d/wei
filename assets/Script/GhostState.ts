import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {UITransform} from "cc";
import {Draw} from "db://assets/Script/Draw";
import nearestAndMoreRoutesSolver from "db://assets/Script/NearestSolver";

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
        this.ghostNode.getComponent(UITransform).setContentSize(HexagonManager.hexagonWidth,HexagonManager.hexagonWidth)
        Global.getInstance().currentGhostVec2 = HexagonManager.center;
        Global.getInstance().prevGhostVec2 = Global.getInstance().currentGhostVec2;
        let point = HexagonManager.getCenter(Global.getInstance().currentGhostVec2);
        this.ghostNode.setPosition(point.x,point.y)
    }

    onUpdate(deltaTime,target) {
        if (Global.getInstance().ghostMoving) {
            let point = HexagonManager.getCenter(Global.getInstance().currentGhostVec2);
            if (point.x == target.node.getPosition().x && point.y == target.node.getPosition().y) {
                Global.getInstance().ghostMoving = false;
            }
            this.ghostNode.setPosition(point.x,point.y)
            if((Global.getInstance().currentGhostVec2.x ==0 && Global.getInstance().currentGhostVec2.y < HexagonManager.HeightCount) ||
                (Global.getInstance().currentGhostVec2.x < HexagonManager.WidthCount && Global.getInstance().currentGhostVec2.y ==0) ||
                (Global.getInstance().currentGhostVec2.x ==HexagonManager.WidthCount-1 && Global.getInstance().currentGhostVec2.y < HexagonManager.HeightCount) ||
                (Global.getInstance().currentGhostVec2.x < HexagonManager.WidthCount && Global.getInstance().currentGhostVec2.y ==HexagonManager.HeightCount-1)
            ) {
                this.lose();
            }
        }
    }

    move(target,params: any[]) {


        let nearHexagonCoords = HexagonManager.getNearbyHexagonCoords();
        // console.log(nearHexagonCoords)

        nearHexagonCoords = nearHexagonCoords.filter(c=>{
            return (c.x>=0 && c.x<HexagonManager.WidthCount && c.y>=0 && c.y<HexagonManager.HeightCount);
        })
        if (!(nearHexagonCoords&&nearHexagonCoords.length>0)) {
            target.win();
            return;
        }
        // let randomIndex = Math.floor(Math.random() * nearHexagonCoords.length);
        let randomIndex = nearestAndMoreRoutesSolver(Global.getInstance().currentGhostVec2.x,Global.getInstance().currentGhostVec2.y);
        console.log(randomIndex)
        let x = nearHexagonCoords[randomIndex].x;
        let y = nearHexagonCoords[randomIndex].y;
        if (!(Global.getInstance().currentGhostVec2.x == Global.getInstance().prevGhostVec2.x && Global.getInstance().currentGhostVec2.y == Global.getInstance().prevGhostVec2.y)) {
            Global.getInstance().prevGhostVec2.set(Global.getInstance().currentGhostVec2);
        }
        Global.getInstance().currentGhostVec2.set(x,y);
        Global.getInstance().ghostMoving = true;

    }
    win() {
        console.log("你赢了")
        Global.getInstance().gameState = GameStateEnum.win;
    }
    lose() {
        console.log("你输了")
        Global.getInstance().gameState = GameStateEnum.lose;
    }


    nearestAndMore

}
export enum GhostMessage{
    move="move",
    win="win",
    lose="lose",
}