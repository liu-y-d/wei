import {IProcessStateNode,} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {
    Button,
    EventTouch,
    find,
    Graphics,
    instantiate,
    Label,
    Layers,
    Layout,
    Node,
    resources,
    Size,
    Sprite,
    SpriteFrame,
    tween,
    UITransform,
    Vec3,
    Color,
    assetManager
} from "cc";
import {GameCtrl} from "db://assets/Script/GameCtrl";
import {Draw} from "db://assets/Script/Draw";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {GameStateEnum, Global} from "db://assets/Script/Global";
import {GhostMessage} from "db://assets/Script/GhostState";
import {ObstacleMessage} from "db://assets/Script/ObstacleState";
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";
import {PropsNum} from "db://assets/Script/PropsNum";
import {PrefabController} from "db://assets/Script/PrefabController";
import {UIManager} from "db://assets/Script/UIManager";
import {DestinationMessage} from "db://assets/Script/DestinationProcessState";
import {MapPropsMessage, MapPropsProcessState} from "db://assets/Script/MapPropsProcessState";
import {GamePropsEnum} from "db://assets/Script/BaseProps";

export class GameProcessState implements IProcessStateNode {
    readonly key = ProcessStateEnum.game;
    _listener: { [p: string]: (target, params) => (void | null) };


    onExit() {
    }

    onHandlerMessage() {
    }

    onInit() {
        Global.getInstance().gameCanvas = find('Canvas');
        // UIManager.getInstance().init();
        // Global.getInstance().gameCanvas.addChild(UIManager.getInstance().maskGlobal)
        Global.getInstance().playArea = Global.getInstance().gameCanvas.getChildByName('Content').getChildByName('PlayArea');

        // this.gameCanvas.getChildByName('PlayArea').on(Node.EventType.TOUCH_START,this.onClick,this);
        let gameCtrl = Global.getInstance().gameCanvas.getComponent(GameCtrl);
        // LevelDesign.getInstance().init();
        this.playAreaInit(gameCtrl)
        this.propsAreaInit(gameCtrl,()=>{
            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.panel);
            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.ghost);
            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.destination);
            if (Global.getInstance().getPlayerInfo().gameLevel == 1) {
                UIManager.getInstance().showFistGuide();
            }
        })
        let detailPanel = Global.getInstance().gameCanvas.getChildByName("Content").getChildByName('DetailPanel');
        let Detail = detailPanel.getChildByName("Detail");
        let DetailTip = detailPanel.getChildByName("DetailTip");
        let numLabel = DetailTip.getChildByName("Num").getComponent(Label);
        numLabel.string = ""+LevelDesign.getInstance().currentMovableDirection

        let color = new Color();
        numLabel.color = Color.fromHEX(color, LevelDesign.getInstance().getDifficultyInfo().bgColor)
        detailPanel.getChildByName("SpriteSplash").getComponent(Sprite).color = Color.fromHEX(color, LevelDesign.getInstance().getDifficultyInfo().bgColor)

        // #288319
        //
    }

    onUpdate() {
    }

    simulation() {
        let info = Global.getInstance().getPlayerInfo();
        if (!info) {
            info = {
                playerId: '1',
                nickName: '玩家',
                gameLevel: 1,
                avatarUrl: null
            }
            Global.getInstance().setPlayerInfo(info)
        }

        // LevelDesign.getInstance().showGhostDirection = true;
        // LevelDesign.getInstance().init();
    }

    propsAreaInit(gameCtrl: GameCtrl,callback:Function) {
        let gamePropsArea = Global.getInstance().gameCanvas.getChildByName('Content').getChildByName('GameProps');
        let propsContent = gamePropsArea.getChildByName('ScrollView').getChildByName('view').getChildByName('content');
        propsContent.removeAllChildren();
        let levelPropsArray = LevelDesign.getInstance().levelPropsArray;
        let propsUsableConfig = LevelDesign.getInstance().propsUsableConfig;

        /**
         * 初始化道具节点
         * @param spriteFrame
         * @param props
         * @param propsContent
         */
        function propsNodeInit(spriteFrame: SpriteFrame, props, propsContent) {
            // 创建一个新的节点
            const iconNode = new Node("icon");
            iconNode.layer = Layers.Enum.UI_2D;
            // 将 Sprite 组件添加到节点上
            iconNode.addComponent(Sprite);
            let sprite = iconNode.getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
            iconNode.addComponent(Button);
            iconNode.on(Button.EventType.CLICK, props.inure, props);
            iconNode.getComponent(UITransform).setContentSize(iconNode.getComponent(UITransform).contentSize.width - 20, iconNode.getComponent(UITransform).contentSize.height - 20,);


            const newNodeParent = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).props);
            newNodeParent.name = props.name;
            newNodeParent.layer = Layers.Enum.UI_2D;
            // newNodeParent.addComponent(UITransform);
            // newNodeParent.getComponent(UITransform).setContentSize(110,110);
            // newNodeParent.addComponent(Sprite);
            // newNodeParent.getComponent(Sprite).spriteFrame = "default_panel"
            // newNodeParent.addComponent(Graphics);
            // newNodeParent.addComponent(PropsNum);
            const propsNum = new Node("propsNum");
            propsNum.layer = Layers.Enum.UI_2D;
            propsNum.addComponent(UITransform);
            propsNum.addComponent(Graphics);
            propsNum.addComponent(PropsNum);
            const propsNumLabel = new Node("propsNumLabel");
            propsNumLabel.layer = Layers.Enum.UI_2D;
            propsNumLabel.addComponent(Label);
            propsNum.addChild(propsNumLabel);
            newNodeParent.addChild(propsNum);
            newNodeParent.addChild(iconNode);
            newNodeParent.active = false;
            propsContent.addChild(newNodeParent);
            propsNum.getComponent(PropsNum).drawRedDot();
            props.target = newNodeParent;
            props.setNum(props.defaultNum);
        }

        let currentIndex = 0;
        let num = 0;

        /**
         * 动态调整道具分布
         */
        function dynamicDistributingProps(num) {
            let totalWidth = propsContent.getComponent(UITransform).contentSize.width
            let realWidth = num * 110 + (num + 1) * 50;
            let pitch = 50;
            if (realWidth <= totalWidth) {
                pitch += (totalWidth - realWidth) == 0 ? 0 : (totalWidth - realWidth) / (num + 1)
                propsContent.getComponent(Layout).paddingLeft = pitch;
                propsContent.getComponent(Layout).paddingRight = pitch;
                propsContent.getComponent(Layout).spacingX = pitch;
            } else {
                propsContent.getComponent(Layout).paddingLeft = pitch;
                propsContent.getComponent(Layout).spacingX = pitch;
            }
        }

        /**
         * 加载道具资源
         */
        function loadPropsResources() {
            if (currentIndex >= levelPropsArray.size) {
                console.log('所有资源已按顺序加载完毕');
                dynamicDistributingProps(propsContent.children.length);
                propsContent.children.forEach(n => {
                    n.active = true;
                })
                propsContent.getComponent(Layout).updateLayout()
                gamePropsArea.scale = new Vec3(0,0,0)
                tween(gamePropsArea).to(0.5,{scale:new Vec3(1,1,1)}).call(()=>{
                    callback();
                }).start()
                return;
            }

            let props = levelPropsArray.get(currentIndex);

            if (props && props.init()) {
                assetManager.getBundle("img").load(props.spriteFrameUrl, SpriteFrame, (err: any, spriteFrame) => {
                    propsNodeInit(spriteFrame, props, propsContent);
                    currentIndex++;
                    num++;
                    loadPropsResources();
                });

            } else {
                currentIndex++;
                loadPropsResources();
            }

        }

        loadPropsResources();


    }

    playAreaInit(gameCtrl: GameCtrl) {
        let playArea = Global.getInstance().gameCanvas.getChildByName('Content').getChildByName('PlayArea');
        playArea.on(Node.EventType.TOUCH_END, this.onClick, this);

        let moveLock = Global.getInstance().gameCanvas.getChildByName('Content').getChildByName('MoveLock');
        moveLock.on(Node.EventType.TOUCH_START, () => {
        }, this);
        Global.getInstance().moveLock = moveLock;
        playArea.getChildByName('Direct').setPosition(320, 1050)
        let size: Size = playArea.getComponent(UITransform).contentSize;
        // playArea.getComponent(Graphics)
        Global.getInstance().pathInit();
        this.simulation()
        let shapes = LevelDesign.getInstance().getShapeManager().initMap(size.width);
        this.clearTile();
        Global.getInstance().tileMap = {};
        for (let shape of shapes) {
            let tile = instantiate(gameCtrl.tile)
            tile.setSiblingIndex(1);
            tile.getComponent(Draw).draw(shape);
            playArea.addChild(tile);

            if (!Global.getInstance().tileMap[shape.x]) {
                Global.getInstance().tileMap[shape.x] = new Array<Node>();
            }
            Global.getInstance().tileMap[shape.x].splice(shape.y, 0, tile);
        }

    }

    clearTile() {
        let tileMap = Global.getInstance().tileMap;
        if (tileMap != null) {
            Object.keys(tileMap).forEach(key => {
                for (let i = 0; i < tileMap[key].length; i++) {
                    if (tileMap[key][i].parent) {
                        tileMap[key][i].parent.removeChild(tileMap[key][i]);
                    }
                }
            })
        }
    }

    // 自定义的辅助函数示例，根据实际情况修改
    isPrefabInstance(node) {
        return node._name == 'Tile'; // 或者通过预制体特有的组件来判断
    }

    onClick(event: EventTouch) {
        if (Global.getInstance().defaultObstacleNum == Global.getInstance().obstacleCoords.length) {
            Global.getInstance().gameState = GameStateEnum.ing;
        }

        if (Global.getInstance().gameState != GameStateEnum.ing || Global.getInstance().ghostMoving == true) {
            return;
        }
        let vec2 = event.getUILocation();
        let vec3 = Global.getInstance().playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(vec2.x, vec2.y, 0))
        let coord = LevelDesign.getInstance().getShapeManager().getShape(vec3.x, vec3.y);
        if (!coord || coord.x < 0 || coord.y < 0 || coord.x > LevelDesign.getInstance().getShapeManager().WidthCount - 1 || coord.y > LevelDesign.getInstance().getShapeManager().HeightCount - 1) {
            return;
        }
        let tile = Global.getInstance().tileMap[coord.x][coord.y].getComponent(Draw);
        if ((Global.getInstance().currentGhostVec2.x == coord.x && Global.getInstance().currentGhostVec2.y == coord.y) || tile.hasObstacle||tile.isDestination||tile.isMapPropsDirection) {
            // if (!this.isTweening) {
            //     this.isTweening = true;
            let self = this;
            let angle = 20;
            const wx = window['wx'];
            if (wx) {
                wx.vibrateShort({
                    type: 'medium'
                })
            }
            tween(Global.getInstance().tileMap[coord.x][coord.y])
                .to(0.1, {angle: -angle})
                .to(0.1, {angle: angle})
                .to(0.1, {angle: 0})
                .call(() => {
                    // self.isTweening = false;
                })
                .start();
            // }
            return;
        }
        const wx = window['wx'];
        if (wx) {
            wx.vibrateShort({
                type: 'light'
            })
        }

        let hasMapProps = false;
        let mapProps
        for (let i = 0; i <LevelDesign.getInstance().currentMapProps.length; i++) {
            if (LevelDesign.getInstance().currentMapProps[i].coord.x==coord.x && LevelDesign.getInstance().currentMapProps[i].coord.y == coord.y) {
                hasMapProps = true;
                mapProps = LevelDesign.getInstance().currentMapProps[i].mapProps;
            }
        }
        if (hasMapProps&&mapProps) {
            if (mapProps.id == GamePropsEnum.CreateStarAbsorb) {
                if (LevelDesign.getInstance().currentDestination.length < 3) {
                    ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle, ObstacleMessage.create, coord);
                    ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
                }else {
                    mapProps.exec(coord,()=>{
                    })
                }
            } else if(mapProps.id == GamePropsEnum.CreateDirection) {
                let nearbyShapeCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords(coord);
                nearbyShapeCoords = nearbyShapeCoords.filter(n=>n.x >= 0 && n.x < LevelDesign.getInstance().getShapeManager().WidthCount && n.y >= 0 && n.y < LevelDesign.getInstance().getShapeManager().HeightCount )
                nearbyShapeCoords = nearbyShapeCoords.filter(n=> !Global.getInstance().tileMap[n.x][n.y].getComponent(Draw).hasObstacle)
                if (nearbyShapeCoords.length > 0) {
                    // 如果附近图块全是加速带并且加速带的方向都指向当前位置 则不创建道具
                    nearbyShapeCoords = nearbyShapeCoords.filter(n=>{
                        let component = Global.getInstance().tileMap[n.x][n.y].getComponent(Draw);
                        return !(component.isMapPropsDirection && component.mapPropsDirection.x == coord.x &&  component.mapPropsDirection.y == coord.y)
                    })
                    if (nearbyShapeCoords.length > 0) {
                        mapProps.exec(coord,()=>{
                        },MapPropsProcessState.getRandomUniqueFromArray(nearbyShapeCoords,1)[0])
                    }else {
                        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle, ObstacleMessage.create, coord);
                        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
                    }
                }else {
                    ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle, ObstacleMessage.create, coord);
                    ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
                }
            }else {
                mapProps.exec(coord,()=>{
                })
            }
        }else {
            ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle, ObstacleMessage.create, coord);
            ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
        }
        // let randomValue = Math.random();
        // if (randomValue > 0.5) {
        //     ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.destination, DestinationMessage.CreateOne, coord,()=>{
        //         UIManager.getInstance().showMapPropsGuide(()=>{
        //             ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
        //         },coord,"创建了一个新的目标点")
        //
        //     });
        // }else {
        //     ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle, ObstacleMessage.create, coord);
        //     ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost, GhostMessage.move)
        //
        // }
    }

}
