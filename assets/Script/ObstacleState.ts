import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Coord, Global} from "db://assets/Script/Global";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Draw} from "db://assets/Script/Draw";
import {GhostMessage, GhostState} from "db://assets/Script/GhostState";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {LevelDesign} from "db://assets/Script/LevelDesign";

export class ObstacleState implements IProcessStateNode{
    key: string = ProcessStateEnum.obstacle;
    _listener: { [code: string]: ( params: any) => void; } = {};

    onExit() {
    }

    onHandlerMessage(code: string, params) {

        this._listener[code](params);
    }

    onInit() {
        this._listener[ObstacleMessage.create] = this.createObstacle;
        this.createDefaultObstacle();
    }

    onUpdate(deltaTime, target) {
    }

    createDefaultObstacle(){
        Global.getInstance().moveLock.active = true;
        LevelDesign.getInstance().getShapeManager().createDefaultObstacle();
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.mapProps);

    }

    createObstacle(params){
        let coord = params[0];
        if (coord) {
            let tile = Global.getInstance().tileMap[coord.x][coord.y].getComponent(Draw);
            tile.creatorObstacle();
            let nearbyShapeCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords(coord);
            if (nearbyShapeCoords.length > 0) {
                nearbyShapeCoords = nearbyShapeCoords.filter(n=>n.x >= 0 && n.x < LevelDesign.getInstance().getShapeManager().WidthCount && n.y >= 0 &&n.y < LevelDesign.getInstance().getShapeManager().HeightCount)
                nearbyShapeCoords.forEach(n=>{
                    let tile = Global.getInstance().tileMap[n.x][n.y];
                    let component = tile.getComponent(Draw);
                    if (component.isMapPropsDirection && component.mapPropsDirection.x == coord.x && component.mapPropsDirection.y == coord.y) {
                        component.draw({
                            x: n.x,
                            y: n.y,
                            shape: LevelDesign.getInstance().currentShapeEnum
                        })

                        component.isMapPropsDirection = false;
                        component.mapPropsDirection = null;
                        let direction = tile.getChildByName("MapPropsDirection");
                        if (direction){
                            direction.removeFromParent();
                        }
                    }
                })
            }
            Global.getInstance().obstacleCoords.push(coord)
            Global.getInstance().addPlayerPath(coord);

        }
    }

}
export enum ObstacleMessage{
    create="create"
}
