import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Button,Label,Graphics,EventTouch, find, instantiate, Node, Size, UITransform, Vec3,Sprite,resources,SpriteFrame,Layers,Layout,tween,Vec2} from "cc";
import {GameCtrl} from "db://assets/Script/GameCtrl";
import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Draw} from "db://assets/Script/Draw";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {GameStateEnum, Global, PlayerInfo} from "db://assets/Script/Global";
import {GhostMessage} from "db://assets/Script/GhostState";
import {ObstacleMessage} from "db://assets/Script/ObstacleState";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ShapeEnum, ShapeManager} from "db://assets/Script/ShapeManager";
import {PropsNum} from "db://assets/Script/PropsNum";
import {UIManager} from "db://assets/Script/UIManager";
import {PrefabController} from "db://assets/Script/PrefabController";
import {DestinationProcessState} from "db://assets/Script/DestinationProcessState";

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
        Global.getInstance().playArea = Global.getInstance().gameCanvas.getChildByName('PlayArea');

        // this.gameCanvas.getChildByName('PlayArea').on(Node.EventType.TOUCH_START,this.onClick,this);
        let gameCtrl = Global.getInstance().gameCanvas.getComponent(GameCtrl);
        // LevelDesign.getInstance().init();
        this.playAreaInit(gameCtrl)
        this.propsAreaInit(gameCtrl)
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.panel);
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.ghost);
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.destination);

    }

    onUpdate() {
    }

    simulation() {
        let info = Global.getInstance().getPlayerInfo();
        if (!info) {
            info = {
                playerId:'1',
                nickName:'云达',
                gameLevel:1,
                avatarUrl:null
            }
            Global.getInstance().setPlayerInfo(info)
        }

        // LevelDesign.getInstance().showGhostDirection = true;
        // LevelDesign.getInstance().init();
    }
    propsAreaInit(gameCtrl:GameCtrl) {
        let gamePropsArea = Global.getInstance().gameCanvas.getChildByName('GameProps');
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
        function propsNodeInit(spriteFrame:SpriteFrame,props,propsContent){
            // 创建一个新的节点
            const iconNode = new Node("icon");
            iconNode.layer =Layers.Enum.UI_2D;
            // 将 Sprite 组件添加到节点上
            iconNode.addComponent(Sprite);
            let sprite = iconNode.getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
            iconNode.addComponent(Button);
            iconNode.on(Button.EventType.CLICK, props.inure, props);
            iconNode.getComponent(UITransform).setContentSize(iconNode.getComponent(UITransform).contentSize.width - 20,iconNode.getComponent(UITransform).contentSize.height - 20,);


            const newNodeParent = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).props);
            newNodeParent.name = props.name;
            newNodeParent.layer =Layers.Enum.UI_2D;
            // newNodeParent.addComponent(UITransform);
            // newNodeParent.getComponent(UITransform).setContentSize(110,110);
            // newNodeParent.addComponent(Sprite);
            // newNodeParent.getComponent(Sprite).spriteFrame = "default_panel"
            // newNodeParent.addComponent(Graphics);
            // newNodeParent.addComponent(PropsNum);
            const propsNum = new Node("propsNum");
            propsNum.layer =Layers.Enum.UI_2D;
            propsNum.addComponent(UITransform);
            propsNum.addComponent(Graphics);
            propsNum.addComponent(PropsNum);
            const propsNumLabel = new Node("propsNumLabel");
            propsNumLabel.layer =Layers.Enum.UI_2D;
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
                pitch +=(totalWidth - realWidth) == 0?0:(totalWidth - realWidth) / (num + 1)
                propsContent.getComponent(Layout).paddingLeft = pitch;
                propsContent.getComponent(Layout).paddingRight = pitch;
                propsContent.getComponent(Layout).spacingX = pitch;
            }else {
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
                propsContent.children.forEach(n=>{
                    n.active = true;
                })
                return;
            }

            let props = levelPropsArray.get(currentIndex);

            if (props && props.init()) {
                resources.load(props.spriteFrameUrl, SpriteFrame, (err: any, spriteFrame) => {
                    propsNodeInit(spriteFrame,props,propsContent);
                    currentIndex++;
                    num++;
                    loadPropsResources();
                });
            }else {
                currentIndex++;
                loadPropsResources();
            }

        }
        loadPropsResources();




    }

    playAreaInit(gameCtrl:GameCtrl) {
        let playArea = Global.getInstance().gameCanvas.getChildByName('PlayArea');
        playArea.on(Node.EventType.TOUCH_END,this.onClick,this);

        let moveLock = Global.getInstance().gameCanvas.getChildByName('MoveLock');
        moveLock.on(Node.EventType.TOUCH_START,()=>{},this);
        Global.getInstance().moveLock = moveLock;
        playArea.getChildByName('Direct').setPosition(320,1050)
        let size: Size= playArea.getComponent(UITransform).contentSize;
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
            Global.getInstance().tileMap[shape.x].splice(shape.y,0,tile);
        }

    }
    clearTile(){
        let tileMap = Global.getInstance().tileMap;
        if ( tileMap != null) {
            Object.keys(tileMap).forEach(key=>{
                for(let i= 0; i < tileMap[key].length; i++ ) {
                    if(tileMap[key][i].parent) {
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

    onClick(event :EventTouch) {
        console.log(event)
        if (Global.getInstance().defaultObstacleNum == Global.getInstance().obstacleCoords.length) {
            Global.getInstance().gameState = GameStateEnum.ing;
        }

        if (Global.getInstance().gameState != GameStateEnum.ing || Global.getInstance().ghostMoving == true) {
            return;
        }
        let vec2= event.getUILocation();
        let vec3 = Global.getInstance().playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(vec2.x,vec2.y,0))
        let coord = LevelDesign.getInstance().getShapeManager().getShape(vec3.x,vec3.y);
        if (!coord || coord.x <0 || coord.y<0) {
            return;
        }
        let tile = Global.getInstance().tileMap[coord.x][coord.y].getComponent(Draw);
        if ((Global.getInstance().currentGhostVec2.x == coord.x && Global.getInstance().currentGhostVec2.y == coord.y) || tile.hasObstacle) {
            // if (!this.isTweening) {
            //     this.isTweening = true;
                let self = this;
                let angle = 20;

                tween(Global.getInstance().tileMap[coord.x][coord.y])
                    .to(0.1,{angle: -angle})
                    .to(0.1,{angle:angle})
                    .to(0.1,{angle:0})
                    .call(()=>{
                        // self.isTweening = false;
                    })
                    .start();
            // }
            return;
        }
        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle,ObstacleMessage.create,coord);
        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost,GhostMessage.move)
    }

}