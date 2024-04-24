import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Coord, GameStateEnum, Global} from "db://assets/Script/Global";
import {misc, Node, Label, Sprite, Animation, Color, tween, Vec2, Vec3} from "cc";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Draw} from "db://assets/Script/Draw";
import {Shape} from "db://assets/Script/Shape";
import {Ghost} from "db://assets/Script/Ghost";
import {UIManager} from "db://assets/Script/UIManager";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {GamePropsEnum} from "db://assets/Script/BaseProps";

export class GhostState implements IProcessStateNode {
    readonly key = ProcessStateEnum.ghost;


    public unitSet: number[] = [0, 1, -1]

    _listener: { [code: string]: (target, params) => void | null } = {}

    public ghostNode: Node;

    onExit() {
    }

    onHandlerMessage(code: string, params) {
        this._listener[code](this, params);

        // Global.getInstance().ghostMoving = false;
    }

    onInit() {
        this._listener[GhostMessage.move] = this.move;
        this._listener[GhostMessage.freeze] = this.freeze;
        this._listener[GhostMessage.unfreeze] = this.unfreeze;
        this._listener[GhostMessage.back] = this.back;
        this.ghostNode = Global.getInstance().playArea.getChildByName('Ghost');
        this.ghostNode.setSiblingIndex(9999);
        // this.ghostNode.getComponent(UITransform).setContentSize(LevelDesign.getInstance().getShapeManager().shapeWidth,LevelDesign.getInstance().getShapeManager().shapeWidth)
        Global.getInstance().currentGhostVec2 = LevelDesign.getInstance().getShapeManager().center.clone();
        Global.getInstance().prevGhostVec2 = Global.getInstance().currentGhostVec2;
        let point = LevelDesign.getInstance().getShapeManager().getCenter(Global.getInstance().currentGhostVec2);
        this.ghostNode.setPosition(point.x, point.y + 10)
        this.ghostNode.active = true;
        this.ghostNode.angle = 0;
        let  freezeNum = this.ghostNode.getChildByName("FreezeNum");

        freezeNum.getComponent(Label).string = Global.getInstance().ghostFreezeNum.toString();

        freezeNum.active = false;
        let color = new Color();
        this.ghostNode.getComponent(Sprite).color = Color.fromHEX(color, "#FFFFFF")
        this.ghostNode.getComponent(Animation).play();


        // this.ghostNode.getComponent(Ghost).draw();

        // if (LevelDesign.getInstance().showGhostDirection) {
        // 如果显示下一步行进方向 则需要提前计算好方向
        let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

        let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x, Global.getInstance().currentGhostVec2.y);
        if (randomIndex == -1) {
            this.win();
            return;
        }
        Global.getInstance().predictCoord = {x: nearHexagonCoords[randomIndex].x, y: nearHexagonCoords[randomIndex].y}

        if (LevelDesign.getInstance().showGhostDirection) {
            this.setDirectPosition()
        } else {
            LevelDesign.getInstance().getShapeManager().closeDirect();
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
        LevelDesign.getInstance().getShapeManager().direct(Global.getInstance().predictCoord,0.25);
    }

    onUpdate(deltaTime, target) {
    }


    move(target, params: any[]) {
        if (Global.getInstance().ghostFreezeNum > 0) {
            ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.unfreeze)
            return;
        }
        Global.getInstance().ghostMoving = true;
        Global.getInstance().moveLock.active = true;
        LevelDesign.getInstance().getShapeManager().closeDirect();
        let x, y;
        // 移动时如果 下一步位置被占用了则重新计算并移动
        if (Global.getInstance().predictCoord && Global.getInstance().tileMap[Global.getInstance().predictCoord.x][Global.getInstance().predictCoord.y].getComponent(Draw).hasObstacle) {
            let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

            let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x, Global.getInstance().currentGhostVec2.y);
            if (randomIndex == -1) {
                Global.getInstance().ghostMoving = false;
                Global.getInstance().moveLock.active = false;
                target.win();
                return;
            }
            x = nearHexagonCoords[randomIndex].x;
            y = nearHexagonCoords[randomIndex].y;
        } else {
            x = Global.getInstance().predictCoord.x;
            y = Global.getInstance().predictCoord.y;
        }
        // let component = Global.getInstance().tileMap[Global.getInstance().currentGhostVec2.x][Global.getInstance().currentGhostVec2.y].getComponent(Draw);
        // if (component.isMapPropsDirection && component.mapPropsDirection.x == Global.getInstance().currentGhostVec2.x && component.mapPropsDirection.y == Global.getInstance().currentGhostVec2.y ) {
        let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();
        nearHexagonCoords = nearHexagonCoords.filter(n=>n.x >= 0 && n.x < LevelDesign.getInstance().getShapeManager().WidthCount && n.y >= 0 && n.y < LevelDesign.getInstance().getShapeManager().HeightCount )
        nearHexagonCoords = nearHexagonCoords.filter(n=> !Global.getInstance().tileMap[n.x][n.y].getComponent(Draw).hasObstacle)
        nearHexagonCoords = nearHexagonCoords.filter(n=>{
            let component = Global.getInstance().tileMap[n.x][n.y].getComponent(Draw);
            return !(component.isMapPropsDirection && component.mapPropsDirection.x == Global.getInstance().currentGhostVec2.x &&  component.mapPropsDirection.y == Global.getInstance().currentGhostVec2.y)
        })

        if (nearHexagonCoords.length == 0) {
            Global.getInstance().ghostMoving = false;
            Global.getInstance().moveLock.active = false;
            target.win();
            return;
        }

        // }


        if (!(Global.getInstance().currentGhostVec2.x == Global.getInstance().prevGhostVec2.x && Global.getInstance().currentGhostVec2.y == Global.getInstance().prevGhostVec2.y)) {
            Global.getInstance().prevGhostVec2.set(Global.getInstance().currentGhostVec2);
        }
        Global.getInstance().currentGhostVec2.set(x, y);
        Global.getInstance().addGhostPath({x: x, y: y});
        // Global.getInstance().ghostMoving = true;

        let self = target;
        let point = LevelDesign.getInstance().getShapeManager().getCenter(Global.getInstance().currentGhostVec2);
        let originalX = target.ghostNode.getPosition().x;
        let originalY = target.ghostNode.getPosition().y;

        let angle = Math.atan2(point.x - originalX, point.y - originalY);
        angle = misc.radiansToDegrees(angle); // 将弧度转换为角度
        // 考虑到Cocos Creator的rotation是顺时针为正，因此需要取反角度值以使右侧为0度
        tween(target.ghostNode)
            // 同时设置节点的位置，缩放和旋转
            .to(0.25, {angle: -angle})
            .to(0.25, {position: new Vec3(point.x, point.y + 10, 0)})
            .call(() => {
                if (LevelDesign.getInstance().getShapeManager().isDestination(Global.getInstance().currentGhostVec2)) {
                    Global.getInstance().ghostMoving = false;
                    Global.getInstance().moveLock.active = false;
                    self.lose();
                    return;
                }
                let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

                let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x, Global.getInstance().currentGhostVec2.y);
                if (randomIndex == -1) {
                    Global.getInstance().ghostMoving = false;
                    Global.getInstance().moveLock.active = false;
                    self.win();
                    return;
                }
                Global.getInstance().predictCoord = {
                    x: nearHexagonCoords[randomIndex].x,
                    y: nearHexagonCoords[randomIndex].y
                }
                if (LevelDesign.getInstance().showGhostDirection) {
                    self.setDirectPosition()
                } else {
                    LevelDesign.getInstance().getShapeManager().closeDirect();
                }
                Global.getInstance().ghostMoving = false;
                Global.getInstance().moveLock.active = false;
                if (Global.getInstance().tileMap[Global.getInstance().currentGhostVec2.x][Global.getInstance().currentGhostVec2.y].getComponent(Draw).isMapPropsDirection) {
                    let tile = Global.getInstance().tileMap[Global.getInstance().currentGhostVec2.x][Global.getInstance().currentGhostVec2.y];
                    Global.getInstance().predictCoord = {
                        x: tile.getComponent(Draw).mapPropsDirection.x,
                        y: tile.getComponent(Draw).mapPropsDirection.y
                    }

                    Global.getInstance().addJiaSuDaiPath({x: x, y: y});
                    ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
                }
            })
            .start();

    }

    back(target, params: any[]) {
        if (Global.getInstance().ghostFreezeNum > 0) {
            ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.unfreeze)
            return;
        }
        Global.getInstance().ghostMoving = true;
        Global.getInstance().moveLock.active = true;
        LevelDesign.getInstance().getShapeManager().closeDirect();
        let self = target;
        let point = LevelDesign.getInstance().getShapeManager().getCenter(Global.getInstance().currentGhostVec2);
        let originalX = target.ghostNode.getPosition().x;
        let originalY = target.ghostNode.getPosition().y;

        let angle = Math.atan2(point.x - originalX, point.y - originalY);
        angle = misc.radiansToDegrees(angle); // 将弧度转换为角度
        // 考虑到Cocos Creator的rotation是顺时针为正，因此需要取反角度值以使右侧为0度
        tween(target.ghostNode)
            // 同时设置节点的位置，缩放和旋转
            .to(0.25, {angle: -angle})
            .to(0.25, {position: new Vec3(point.x, point.y + 10, 0)})
            .call(() => {
                if (LevelDesign.getInstance().getShapeManager().isDestination(Global.getInstance().currentGhostVec2)) {
                    Global.getInstance().ghostMoving = false;
                    Global.getInstance().moveLock.active = false;
                    self.lose();
                    return;
                }
                let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();

                let randomIndex = LevelDesign.getInstance().ghostMoveAlgorithms(Global.getInstance().currentGhostVec2.x, Global.getInstance().currentGhostVec2.y);
                if (randomIndex == -1) {
                    Global.getInstance().ghostMoving = false;
                    Global.getInstance().moveLock.active = false;
                    self.win();
                    return;
                }
                Global.getInstance().predictCoord = {
                    x: nearHexagonCoords[randomIndex].x,
                    y: nearHexagonCoords[randomIndex].y
                }
                if (LevelDesign.getInstance().showGhostDirection) {
                    self.setDirectPosition()
                } else {
                    LevelDesign.getInstance().getShapeManager().closeDirect();
                }
                Global.getInstance().ghostMoving = false;
                Global.getInstance().moveLock.active = false;

                if (Global.getInstance().jiaSuDaiPath.length >0) {
                    let coord = Global.getInstance().jiaSuDaiPath[Global.getInstance().jiaSuDaiPath.length - 1];
                    if (coord.x == Global.getInstance().currentGhostVec2.x && coord.y == Global.getInstance().currentGhostVec2.y) {
                        Global.getInstance().jiaSuDaiPath.pop();
                        self.back(self,null)
                    }
                }
            })
            .start();

    }

    win() {
        LevelDesign.getInstance().getShapeManager().closeDirect();
        UIManager.getInstance().gameOver(GameStateEnum.win);
    }

    lose() {
        LevelDesign.getInstance().getShapeManager().closeDirect();
        UIManager.getInstance().gameOver(GameStateEnum.lose);

    }

    freeze(target, params: any[]) {
        Global.getInstance().ghostFreezeNum++;
        let freezeNum = target.ghostNode.getChildByName("FreezeNum");
        freezeNum.active = true;
        // let ice = target.ghostNode.getChildByName("Ice");
        // ice.active = true;

        let color = new Color();
        target.ghostNode.getComponent(Sprite).color = Color.fromHEX(color, "#000000")
        target.ghostNode.getComponent(Animation).pause();
        freezeNum.getComponent(Label).string = Global.getInstance().ghostFreezeNum.toString();
    }

    unfreeze(target, params: any[]) {
        tween(target.ghostNode)
            .to(0.1,{angle: -20})
            .to(0.1,{angle:20})
            .to(0.1,{angle:0})
            .start();
        Global.getInstance().ghostFreezeNum--;
        let freezeNum = target.ghostNode.getChildByName("FreezeNum");

        freezeNum.getComponent(Label).string = Global.getInstance().ghostFreezeNum.toString();
        if (Global.getInstance().ghostFreezeNum <= 0) {
            freezeNum.active = false;
            let color = new Color();
            target.ghostNode.getComponent(Sprite).color = Color.fromHEX(color, "#FFFFFF")
            target.ghostNode.getComponent(Animation).play();

        }
    }

}

export enum GhostMessage {
    move = "move",
    win = "win",
    lose = "lose",
    freeze = "freeze",
    unfreeze = "unfreeze",
    back = "back"
}
