import {Node, director, Vec3, Label, tween,Animation} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Coord, Global} from "db://assets/Script/Global";
import {UIManager} from "db://assets/Script/UIManager";
import {Draw} from "db://assets/Script/Draw";
import {ShapeEnum} from "db://assets/Script/ShapeManager";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {MainMessage} from "db://assets/Script/MainProcessState";

export class MapPropsProcessState implements IProcessStateNode {
    readonly key = ProcessStateEnum.mapProps;

    onExit() {
    }

    onHandlerMessage(code: string, params) {
        this._listener[code](params);
    }

    onInit() {
        this._listener[MapPropsMessage.CreateOneDestination] = this.createOneDestination;
        this._listener[MapPropsMessage.CreateOneDirection] = this.createOneDirection;
        this._listener[MapPropsMessage.CreateStarAbsorb] = this.createStarAbsorb;

        LevelDesign.getInstance().currentMapProps = []
        let coords = new Array<Coord>()
        for (let i = 0; i < LevelDesign.getInstance().getShapeManager().WidthCount - 1; i++) {
            for (let j = 0; j < LevelDesign.getInstance().getShapeManager().WidthCount - 1; j++) {
                if (!(LevelDesign.getInstance().currentDestination.some(c=>c.x==i&&c.y==j) || Global.getInstance().obstacleCoords.some(c=>c.x==i&&c.y==j))) {
                    coords.push({x:i,y:j})
                }
            }
        }
        let randomUniqueFromArray = this.getRandomUniqueFromArray(coords,5);
        for (let i = 0; i < randomUniqueFromArray.length; i++) {
            let randomChoice = Math.floor(Math.random() * 3); // 生成0, 1, 或 2
            switch (randomChoice) {
                case 0:
                    LevelDesign.getInstance().currentMapProps.push({
                        coord:randomUniqueFromArray[i],
                        mapProps:{
                            id:1,
                            name:MapPropsMessage.CreateOneDestination,
                            tip:'创建一个新的目标点',
                            exec:this.createOneDestination
                        }
                    })
                    break;
                case 1:
                    LevelDesign.getInstance().currentMapProps.push({
                        coord:randomUniqueFromArray[i],
                        mapProps:{
                            id:2,
                            name:MapPropsMessage.CreateOneDirection,
                            tip:'创建一个可让布布继续移动的加速带',
                            exec:this.createOneDirection
                        }
                    })
                    break;
                case 2:
                    LevelDesign.getInstance().currentMapProps.push({
                        coord:randomUniqueFromArray[i],
                        mapProps:{
                            id:3,
                            name:MapPropsMessage.CreateStarAbsorb,
                            tip:'创建一个星星吸收器',
                            exec:this.createStarAbsorb
                        }
                    })
                    break;
            }
        }
        console.log(LevelDesign.getInstance().currentMapProps)

    }

    createOneDestination(...params){
        console.log(params)
            let coord = params[0];
            if (!LevelDesign.getInstance().currentDestination.some(c=>c.x==coord.x && c.y==coord.y)) {
                LevelDesign.getInstance().currentDestination.push(coord)
            }
            let tile = Global.getInstance().tileMap[coord.x][coord.y];
            tween(tile)
                .to(0, {scale: new Vec3(2, 2, 0)})
                .to(0.1, {scale: new Vec3(1, 1, 0)})
                .call(() => {
                    tile.getComponent(Draw).drawDestination({x:coord.x,y:coord.y,shape:LevelDesign.getInstance().currentShapeEnum})
                    let detailPanel = Global.getInstance().gameCanvas.getChildByName("Content").getChildByName('DetailPanel');
                    detailPanel.setSiblingIndex(99999999999999999999)
                    detailPanel.getComponent(Animation).play();

                    if (params[1]) {
                        params[1]();
                    }
                    // detailPanel.schedule(function() {
                    //     // 这里的 this 指向 component
                    //     this.doSomething();
                    // }, 5);
                    // // 每隔一秒切换下一个子节点
                    // setInterval(toggleChildSequentially, 2);
                    // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.obstacle);
                    // tween(detailPanel).delay(5).to(0.5,{position:new Vec3(0,260,0)}).start();

                }).start()

    }
    createOneDirection(params){

    }
    createStarAbsorb(params){

    }
    getRandomUniqueFromArray(arr:Coord[], count) {
        // 先对原始数组进行浅复制
        let shuffled = [...arr];

        if (shuffled.length < count) {
            throw new Error('Not enough elements in the array');
        }

        // 创建一个新的数组来存储随机选中的不重复元素
        let result:Coord[] = [];

        while (result.length < count) {
            // 生成一个随机索引
            let randomIndex = Math.floor(Math.random() * shuffled.length);

            // 取出随机索引对应的元素，并从洗牌后的数组中移除它
            let item = shuffled[randomIndex];
            shuffled.splice(randomIndex, 1);

            // 将取出的元素添加到结果数组中，确保不重复
            if (!result.some(i=>i.x == item.x && i.y== item.y)) {
                result.push(item);
            }
        }

        return result;
    }
    onUpdate() {
    }

    _listener: { [p: string]: ( params) => (void | null) } = {};

}
export enum MapPropsMessage{
    CreateOneDestination="CreateOneDestination",
    CreateOneDirection="CreateOneDirection",
    CreateStarAbsorb="CreateOneAbsorb"
}
