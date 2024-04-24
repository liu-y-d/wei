import {Node, Vec2, Vec3, misc, tween, Animation,instantiate} from 'cc';
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
import {PrefabController} from "db://assets/Script/PrefabController";
import {GamePropsEnum} from "db://assets/Script/BaseProps";

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
                if (!(LevelDesign.getInstance().currentDestination.some(c => c.x == i && c.y == j) || Global.getInstance().obstacleCoords.some(c => c.x == i && c.y == j))) {
                    coords.push({x: i, y: j})
                }
            }
        }
        let randomUniqueFromArray = MapPropsProcessState.getRandomUniqueFromArray(coords, 5);
        for (let i = 0; i < randomUniqueFromArray.length; i++) {
            let randomChoice = Math.floor(Math.random() * 3); // 生成0, 1, 或 2
            // let randomChoice = 2;
            switch (randomChoice) {
                case 0:
                    LevelDesign.getInstance().currentMapProps.push({
                        coord: randomUniqueFromArray[i],
                        mapProps: {
                            id: GamePropsEnum.CreateStar,
                            name: MapPropsMessage.CreateOneDestination,
                            tip: '创建一个新的目标点',
                            exec: this.createOneDestination
                        }
                    })
                    break;
                case 1:
                    LevelDesign.getInstance().currentMapProps.push({
                        coord: randomUniqueFromArray[i],
                        mapProps: {
                            id: GamePropsEnum.CreateDirection,
                            name: MapPropsMessage.CreateOneDirection,
                            tip: '创建一个可让布布继续移动的加速带',
                            exec: this.createOneDirection
                        }
                    })
                    break;
                case 2:
                    LevelDesign.getInstance().currentMapProps.push({
                        coord: randomUniqueFromArray[i],
                        mapProps: {
                            id: GamePropsEnum.CreateStarAbsorb,
                            name: MapPropsMessage.CreateStarAbsorb,
                            tip: '创建一个星星吸收器',
                            exec: this.createStarAbsorb
                        }
                    })
                    break;
            }
        }

    }

    createOneDestination(...params) {
        let coord = params[0];

        function f() {
            Global.getInstance().moveLock.active = true;

            if (!LevelDesign.getInstance().currentDestination.some(c => c.x == coord.x && c.y == coord.y)) {
                LevelDesign.getInstance().currentDestination.push(coord)
            }
            let tile = Global.getInstance().tileMap[coord.x][coord.y];
            tween(tile)
                .to(0, {scale: new Vec3(2, 2, 0)})
                .to(0.1, {scale: new Vec3(1, 1, 0)})
                .call(() => {
                    tile.getComponent(Draw).drawDestination({
                        x: coord.x,
                        y: coord.y,
                        shape: LevelDesign.getInstance().currentShapeEnum
                    })
                    let detailPanel = Global.getInstance().gameCanvas.getChildByName("Content").getChildByName('DetailPanel');
                    detailPanel.setSiblingIndex(99999999999999999999)
                    detailPanel.getComponent(Animation).play();

                    if (params[1]) {
                        params[1]();
                        Global.getInstance().moveLock.active = false;
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
        if (Global.getInstance().getPropsConfigById(GamePropsEnum.CreateStarAbsorb)?.showTip) {
            UIManager.getInstance().showMapPropsGuide(() => {
                f()
            }, coord, "创建一个⭐️")
        }else {
            f()
        }


    }

    createOneDirection(...params) {
        let coord = params[0];

        function f() {
            Global.getInstance().moveLock.active = true;

            let tile = Global.getInstance().tileMap[coord.x][coord.y];
            tween(tile)
                .to(0, {scale: new Vec3(2, 2, 0)})
                .to(0.1, {scale: new Vec3(1, 1, 0)})
                .call(() => {
                    tile.getComponent(Draw).drawBottom({
                        x: coord.x,
                        y: coord.y,
                        shape: LevelDesign.getInstance().currentShapeEnum
                    })
                    // let nearbyShapeCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords(coord);


                    let directionProps = instantiate(tile.getComponent(Draw).directionProps);
                    // let targetCoord = nearbyShapeCoords[Math.floor(Math.random()*nearbyShapeCoords.length)];

                    tile.getComponent(Draw).mapPropsDirection = params[2]

                    let targetPoint = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(params[2].x,params[2].y));
                    let currentPoint = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x,coord.y));
                    let angle = Math.atan2(targetPoint.x - currentPoint.x, targetPoint.y - currentPoint.y);
                    angle = misc.radiansToDegrees(angle);
                    directionProps.angle = -angle


                    tile.getComponent(Draw).isMapPropsDirection = true;
                    tile.addChild(directionProps);

                    if (params[1]) {
                        params[1]();
                        Global.getInstance().moveLock.active = false;
                    }

                }).start()
        }
        if (Global.getInstance().getPropsConfigById(GamePropsEnum.CreateDirection)?.showTip) {
            UIManager.getInstance().showMapPropsGuide(() => {
                f()
            }, coord, "创建一个加速带")
        }else {
            f()
        }
    }

    createStarAbsorb(...params) {
        let coord = params[0];

        function f() {
            Global.getInstance().moveLock.active = true;

            let tile = Global.getInstance().tileMap[coord.x][coord.y];
            let whirl = Global.getInstance().playArea.getChildByName("Whirl");
            whirl.setSiblingIndex(9999999)
            whirl.setPosition(new Vec3(tile.getPosition().x,tile.getPosition().y + 10))
            whirl.active = true;
            whirl.getComponent(Animation).play()

            tween(whirl).to(0.5,{scale:new Vec3(1,1,1)}).start()
            let index = 0;
            let destinationArray = MapPropsProcessState.getRandomUniqueFromArray(LevelDesign.getInstance().currentDestination,3);
            let destinationPrefab = Global.getInstance().gameCanvas.getComponent(PrefabController).destination;
            function f1() {
                if (index < destinationArray.length) {
                    let destinationCoord = destinationArray[index];
                    let destinationTile = Global.getInstance().tileMap[destinationCoord.x][destinationCoord.y];

                    let prefab = instantiate(destinationPrefab);
                    prefab.setSiblingIndex(9999999999)
                    Global.getInstance().playArea.addChild(prefab)
                    prefab.setPosition(destinationTile.getPosition())
                    tween(prefab).to(1,{position:tile.getPosition()}).call(()=>{
                        prefab.removeFromParent();
                        destinationTile.getComponent(Draw).draw({
                            x: destinationCoord.x,
                            y: destinationCoord.y,
                            shape: LevelDesign.getInstance().currentShapeEnum
                        })
                        index++
                        if (index == destinationArray.length) {
                            whirl.active = false;
                            tile.getComponent(Draw).drawDestination({
                                x: coord.x,
                                y: coord.y,
                                shape: LevelDesign.getInstance().currentShapeEnum
                            })

                            LevelDesign.getInstance().currentDestination = LevelDesign.getInstance().currentDestination.filter(c=>  !destinationArray.some(d=>c.x == d.x && c.y == d.y))
                            LevelDesign.getInstance().currentDestination.push(coord)
                            if (params[1]) {
                                params[1]();
                                Global.getInstance().moveLock.active = false;
                            }
                        }else {
                            f1()
                        }
                    }).start();
                }

            }
            f1();
        }
        if (Global.getInstance().getPropsConfigById(GamePropsEnum.CreateStarAbsorb)?.showTip) {
            UIManager.getInstance().showMapPropsGuide(() => {
                f()
            }, coord, "创建一个星星吸收器")
        }else {
            f()
        }
    }

    static getRandomUniqueFromArray(arr: Coord[], count) {
        // 先对原始数组进行浅复制
        let shuffled = [...arr];

        if (shuffled.length < count) {
            throw new Error('Not enough elements in the array');
        }

        // 创建一个新的数组来存储随机选中的不重复元素
        let result: Coord[] = [];

        while (result.length < count) {
            // 生成一个随机索引
            let randomIndex = Math.floor(Math.random() * shuffled.length);

            // 取出随机索引对应的元素，并从洗牌后的数组中移除它
            let item = shuffled[randomIndex];
            shuffled.splice(randomIndex, 1);

            // 将取出的元素添加到结果数组中，确保不重复
            if (!result.some(i => i.x == item.x && i.y == item.y)) {
                result.push(item);
            }
        }

        return result;
    }

    onUpdate() {
    }

    _listener: { [p: string]: (params) => (void | null) } = {};

}

export enum MapPropsMessage {
    CreateOneDestination = "CreateOneDestination",
    CreateOneDirection = "CreateOneDirection",
    CreateStarAbsorb = "CreateOneAbsorb"
}
