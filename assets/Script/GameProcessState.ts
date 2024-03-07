import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Label,Graphics,EventTouch, find, instantiate, Node, Size, UITransform, Vec3,Sprite,resources,SpriteFrame,Layers,Layout} from "cc";
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
        // LevelDesign.getInstance().init();
        this.playAreaInit(gameCtrl)
        this.propsAreaInit(gameCtrl)
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.ghost);
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.obstacle);

    }

    onUpdate() {
    }

    simulation() {
        let simulationPlayer: PlayerInfo = {
            playerId:'1',
            nickName:'云达',
            gameLevel:1,
            avatarUrl:null
        }
        Global.getInstance().setPlayerInfo(simulationPlayer)
        LevelDesign.getInstance().init();
        LevelDesign.getInstance().showGhostDirection = true;
    }
    propsAreaInit(gameCtrl:GameCtrl) {
        let gamePropsArea = Global.getInstance().gameCanvas.getChildByName('GameProps');
        let propsContent = gamePropsArea.getChildByName('ScrollView').getChildByName('view').getChildByName('content');





        let levelPropsArray = LevelDesign.getInstance().levelPropsArray;
        let propsUsableConfig = LevelDesign.getInstance().propsUsableConfig;


        // for (let i = 0; i < levelPropsArray.length; i++) {
        //     let props = levelPropsArray[i];
        //     resources.load(props.spriteFrameUrl, SpriteFrame, (err: any, spriteFrame) => {
        //         // 创建一个新的节点
        //         const newNode = new Node(props.name);
        //         newNode.layer =Layers.Enum.UI_2D;
        //         // 将 Sprite 组件添加到节点上
        //         newNode.addComponent(Sprite);
        //         let sprite = newNode.getComponent(Sprite);
        //         sprite.spriteFrame = spriteFrame;
        //         propsContent.addChild(newNode);
        //
        //     });
        // }
        let currentIndex = 0;
        function loadPropsResources() {
            if (currentIndex >= levelPropsArray.length) {
                console.log('所有资源已按顺序加载完毕');
                // 在这里执行需要所有资源都加载完成后的逻辑
                return;
            }

            let props = levelPropsArray[currentIndex];
            resources.load(props.spriteFrameUrl, SpriteFrame, (err: any, spriteFrame) => {
                // 创建一个新的节点
                const iconNode = new Node("icon");
                iconNode.layer =Layers.Enum.UI_2D;
                // 将 Sprite 组件添加到节点上
                iconNode.addComponent(Sprite);
                let sprite = iconNode.getComponent(Sprite);
                sprite.spriteFrame = spriteFrame;

                const newNodeParent = new Node(props.name);
                newNodeParent.layer =Layers.Enum.UI_2D;
                newNodeParent.addComponent(UITransform);
                newNodeParent.getComponent(UITransform).setContentSize(120,120);
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
                propsContent.addChild(newNodeParent);
                propsNum.getComponent(PropsNum).drawRedDot();
                props.node = newNodeParent;
                props.setNum(props.defaultNum);
                currentIndex++;
                loadPropsResources();
            });
        }
        loadPropsResources();
        let totalWidth = propsContent.getComponent(UITransform).contentSize.width
        let realWidth = levelPropsArray.length * 120 + (levelPropsArray.length + 1) * 50;

        let pitch = 50;
        if (realWidth <= totalWidth) {
            pitch +=(totalWidth - realWidth) == 0?0:(totalWidth - realWidth) / (levelPropsArray.length + 1)
            propsContent.getComponent(Layout).paddingLeft = pitch;
            propsContent.getComponent(Layout).paddingRight = pitch;
            propsContent.getComponent(Layout).spacingX = pitch;
        }else {
            propsContent.getComponent(Layout).paddingLeft = pitch;
            propsContent.getComponent(Layout).spacingX = pitch;
        }
        // console.log(propsContent.children)
        // for (let i = 0; i < propsContent.children.length; i++) {
        //     console.log(propsContent.children[i])
        //     propsContent.children[i].getComponent(PropsNum).drawRedDot();
        // }

    }
    playAreaInit(gameCtrl:GameCtrl) {
        let playArea = Global.getInstance().gameCanvas.getChildByName('PlayArea');
        playArea.on(Node.EventType.TOUCH_START,this.onClick,this);
        let size: Size= playArea.getComponent(UITransform).contentSize;
        // playArea.getComponent(Graphics)

        this.simulation()
        let shapes = LevelDesign.getInstance().getShapeManager().initMap(size.width);
        // Global.getInstance().tileMap = {};
        // console.log(playArea.children)
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
        console.log(node._name)
        return node._name == 'Tile'; // 或者通过预制体特有的组件来判断
    }

    onClick(event :EventTouch) {
        console.log(Global.getInstance().gameState)
        if (Global.getInstance().defaultObstacleNum == Global.getInstance().obstacleCoords.length) {
            Global.getInstance().gameState = GameStateEnum.ing;
        }
        console.log(Global.getInstance().gameState)

        if (Global.getInstance().gameState != GameStateEnum.ing) {
            return;
        }
        let vec2= event.getUILocation();
        let vec3 = Global.getInstance().playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(vec2.x,vec2.y,0))
        let coord = LevelDesign.getInstance().getShapeManager().getShape(vec3.x,vec3.y);
        if (!coord) {
            return;
        }
        let tile = Global.getInstance().tileMap[coord.x][coord.y].getComponent(Draw);
        if ((Global.getInstance().currentGhostVec2.x == coord.x && Global.getInstance().currentGhostVec2.y == coord.y) || tile.hasObstacle) {
            console.log("你傻逼啊")
            return;
        }
        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.obstacle,ObstacleMessage.create,coord);
        ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.ghost,GhostMessage.move)
    }

}