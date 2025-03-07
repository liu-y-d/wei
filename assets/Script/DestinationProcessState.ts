import {Node, director, Vec3, Label, tween,Animation} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Global} from "db://assets/Script/Global";
import {UIManager} from "db://assets/Script/UIManager";
import {Draw} from "db://assets/Script/Draw";
import {ShapeEnum} from "db://assets/Script/ShapeManager";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";

export class DestinationProcessState implements IProcessStateNode {
    readonly key = ProcessStateEnum.destination;

    onExit() {
    }

    onHandlerMessage() {
    }

    onInit() {
        Global.getInstance().moveLock.active = true;
        let currentIndex = 0;
        function haha() {
            if (currentIndex < LevelDesign.getInstance().currentDestination.length) {
                let coord = LevelDesign.getInstance().currentDestination[currentIndex];
                let tile = Global.getInstance().tileMap[coord.x][coord.y];
                tween(tile)
                    .to(0, {scale: new Vec3(2, 2, 0)})
                    .to(0.1, {scale: new Vec3(1, 1, 0)})
                    .call(() => {
                        tile.getComponent(Draw).drawDestination({x:coord.x,y:coord.y,shape:LevelDesign.getInstance().currentShapeEnum})
                        currentIndex++;
                        if (currentIndex == LevelDesign.getInstance().currentDestination.length) {
                            let detailPanel = Global.getInstance().gameCanvas.getChildByName("Content").getChildByName('DetailPanel');
                            detailPanel.setSiblingIndex(99999999999999999999)
                            detailPanel.getComponent(Animation).play();

                            // detailPanel.schedule(function() {
                            //     // 这里的 this 指向 component
                            //     this.doSomething();
                            // }, 5);
                            // // 每隔一秒切换下一个子节点
                            // setInterval(toggleChildSequentially, 2);
                            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.obstacle);
                            // tween(detailPanel).delay(5).to(0.5,{position:new Vec3(0,260,0)}).start();
                        }
                        haha();
                    }).start()
            }
        }
        haha();



    }

    onUpdate() {
    }

    _listener: { [p: string]: (target, params) => (void | null) };

}
