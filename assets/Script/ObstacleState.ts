import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Coord, Global} from "db://assets/Script/Global";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Draw} from "db://assets/Script/Draw";
import {GhostMessage, GhostState} from "db://assets/Script/GhostState";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";

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
        let count = 0;
        while(count < Global.getInstance().defaultObstacleNum) {
            let x = Math.floor(Math.random() * (HexagonManager.WidthCount))
            let y = Math.floor(Math.random() * (HexagonManager.HeightCount))
            let tile = Global.getInstance().tileMap[x][y].getComponent(Draw);
            if ((x == HexagonManager.center.x && y == HexagonManager.center.y) || tile.hasObstacle) {
                continue;
            }
            tile.creatorObstacle();
            Global.getInstance().obstacleCoords.push({x,y})
            count++;
        }
    }

    createObstacle(params){
        let coord = params[0];
        if (coord) {
            let tile = Global.getInstance().tileMap[coord.x][coord.y].getComponent(Draw);
            tile.creatorObstacle();
            Global.getInstance().obstacleCoords.push(coord)

        }
    }

}
export enum ObstacleMessage{
    create="create"
}