import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {EventTouch, find, instantiate, Node, Size, UITransform, Vec3} from "cc";
import {GameCtrl} from "db://assets/Script/GameCtrl";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Draw} from "db://assets/Script/Draw";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {GhostMessage} from "db://assets/Script/GhostState";
import {ObstacleMessage} from "db://assets/Script/ObstacleState";

export class GameProcessState implements IProcessStateNode {
    readonly key = ProcessStateEnum.game;
    _listener: { [p: string]: (target, params) => (void | null) };


    onExit() {
    }

    onHandlerMessage() {
    }

    onInit() {
        Global.getInstance().gameCanvas = find('Canvas');
        Global.getInstance().playArea = Global.getInstance().gameCanvas.getChildByName('PlayArea');
        // this.gameCanvas.getChildByName('PlayArea').on(Node.EventType.TOUCH_START,this.onClick,this);
        let gameCtrl = Global.getInstance().gameCanvas.getComponent(GameCtrl);
        this.playAreaInit(gameCtrl)
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.ghost);
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.obstacle);

    }

    onUpdate() {
    }


    playAreaInit(gameCtrl:GameCtrl) {
        let playArea = Global.getInstance().gameCanvas.getChildByName('PlayArea');
        playArea.on(Node.EventType.TOUCH_START,this.onClick,this);
        let size: Size= playArea.getComponent(UITransform).contentSize;
        let listHexagon = HexagonManager.InitMap(size.width,0);
        for (let hexagon of listHexagon) {
            let tile = instantiate(gameCtrl.tile)
            tile.setSiblingIndex(1);
            tile.getComponent(Draw).draw(hexagon);
            playArea.addChild(tile);

            if (!Global.getInstance().tileMap[hexagon.x]) {
                Global.getInstance().tileMap[hexagon.x] = new Array<Node>();
            }
            Global.getInstance().tileMap[hexagon.x].splice(hexagon.y,0,tile);
        }

    }

    onClick(event :EventTouch) {
        if (Global.getInstance().defaultObstacleNum == Global.getInstance().obstacleCoords.length) {
            Global.getInstance().gameState = GameStateEnum.ing;
        }
        if (Global.getInstance().gameState != GameStateEnum.ing) {
            return;
        }
        let vec2= event.getUILocation();
        let vec3 = Global.getInstance().playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(vec2.x,vec2.y,0))
        let coord = HexagonManager.getHexagon(vec3.x,vec3.y);
        let tile = Global.getInstance().tileMap[coord.x][coord.y].getComponent(Draw);
        if ((Global.getInstance().currentGhostVec2.x == coord.x && Global.getInstance().currentGhostVec2.y == coord.y) || tile.hasObstacle) {
            console.log("你傻逼啊")
            return;
        }
        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle,ObstacleMessage.create,coord);
        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost,GhostMessage.move)
    }

}