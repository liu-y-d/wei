import {Node,director,instantiate,find,Label,game,Director,resources,Prefab,screen,UITransform,Vec3,Vec2} from "cc";
import {GameStateEnum, Global, resume} from "db://assets/Script/Global";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {PopupBase} from "db://assets/Script/PopupBase";
import {PopupGameOver} from "db://assets/Script/PopupGameOver";
import {PopupPropsPrompt} from "db://assets/Script/PopupPropsPrompt";
import {Popup} from "db://assets/Script/Popup";
import {PrefabController} from "db://assets/Script/PrefabController";
import {PopupMenu} from "db://assets/Script/PopupMenu";
import {PopupMainMenu} from "db://assets/Script/PopupMainMenu";
import {consumeLeaf, gameOverReq, getLeaf, infinityLeaf, Leaf} from "db://assets/Script/Request";
import {Guide, PopupGuide} from "db://assets/Script/PopupGuide";
import {PopupShare} from "db://assets/Script/PopupShare";
import {GhostMessage} from "db://assets/Script/GhostState";
import {MainMessage} from "db://assets/Script/MainProcessState";
import {PopupMapPropsGuide} from "db://assets/Script/PopupMapPropsGuide";
import {ShapeEnum} from "db://assets/Script/ShapeManager";

export enum PopupEnum {
    /**
     * 游戏结束弹窗
     */
    GAME_OVER,
    /**
     * 道具提示弹窗
     */
    PROPS_PROMPT,
    /**
     * 菜单
     */
    MENU,
    MAIN_MENU,
    GUIDE,
    SHARE,
    mapPropsGuide
}
export class UIManager{
    private static _instance: UIManager;
    public static getInstance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    constructor() {
        if (!this.popupMap) {
            this.popupMap = new Map<number, PopupBase>();

            let popupGameOver = new PopupGameOver();
            let propsPrompt = new PopupPropsPrompt();
            let popupMenu = new PopupMenu();
            let popupMainMenu = new PopupMainMenu();
            let popupGuide = new PopupGuide();
            let popupShare = new PopupShare();
            let popupMapPropsGuide = new PopupMapPropsGuide();
            this.popupMap.set(popupGameOver.type,popupGameOver);
            this.popupMap.set(propsPrompt.type,propsPrompt);
            this.popupMap.set(popupMenu.type,popupMenu);
            this.popupMap.set(popupMainMenu.type,popupMainMenu);
            this.popupMap.set(popupGuide.type,popupGuide);
            this.popupMap.set(popupShare.type,popupShare);
            this.popupMap.set(popupMapPropsGuide.type,popupMapPropsGuide);
        }

    }
    /**
     * 全局遮罩
     */
    maskGlobal:Node;

    /**
     * 全局遮罩
     */
    maskGuideGlobal:Node;

    popupMap:Map<number,PopupBase>;

    init() {
        let canvas = find("Canvas");
        if (!canvas.getChildByName("MaskGlobal")) {
            this.maskGlobal = instantiate(canvas.getComponent(PrefabController).maskGlobal);
            canvas.addChild(this.maskGlobal)
            this.maskGlobal.getChildByName('Background').on(Node.EventType.TOUCH_START, function (event) {
                // UIManager.getInstance().closeMaskGlobal();
            }, this);
            this.maskGlobal.getChildByName('Popup').on(Node.EventType.TOUCH_START, function (event) {
                // UIManager.getInstance().closeMaskGlobal();
            }, this);
        }

        if (!canvas.getChildByName("MaskGuideGlobal")) {
            this.maskGuideGlobal = instantiate(canvas.getComponent(PrefabController).maskGuideGlobal);
            canvas.addChild(this.maskGuideGlobal)
            // this.maskGuideGlobal.getChildByPath('Mask/Background').on(Node.EventType.TOUCH_START, function (event) {
            //     // UIManager.getInstance().closeMaskGlobal();
            // }, this);
            // this.maskGuideGlobal.getChildByName('Popup').on(Node.EventType.TOUCH_START, function (event) {
            //     // UIManager.getInstance().closeMaskGlobal();
            // }, this);
        }

    }


    public openMaskGlobal(){
        UIManager.getInstance().init();
        UIManager.getInstance().maskGlobal.active = true;
    }

    public closeMaskGlobal(){
        if (UIManager.getInstance().maskGlobal) {
            UIManager.getInstance().maskGlobal.active = false;
        }
    }

    public openMaskGuideGlobal(){
        UIManager.getInstance().init();
        UIManager.getInstance().maskGuideGlobal.active = true;
    }

    public closeMaskGuideGlobal(){
        if (UIManager.getInstance().maskGuideGlobal) {
            UIManager.getInstance().maskGuideGlobal.active = false;
        }
    }

    public gameOver(state:GameStateEnum) {

        let orgLevel = Global.getInstance().getPlayerInfo().gameLevel

        let my = this
        gameOverReq(orgLevel,state,(addStatus)=>{
            if (addStatus) {
                if (state == GameStateEnum.win) {
                    Global.getInstance().playerNext();
                    // 目前单机
                    window['wx'].setUserCloudStorage({
                        KVDataList: [{"key":'friendRank', "value": `{"actual_rank":"大神1", "actual_score":"${orgLevel}"}`}]
                        // KVDataList: [{"key":'friendRank', "value": '19'}]
                    }).then(res=>{
                        console.log("上传成功")
                    }).catch(err=>{
                    });
                }

            }
            my.openMaskGlobal()
            let popup = UIManager.getInstance().popupMap.get(PopupEnum.GAME_OVER) as PopupGameOver;
            popup.overType = state  == GameStateEnum.win;
            popup.resume = ()=>{
                UIManager.getInstance().gameContinue();
            }
            UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.GAME_OVER);
        })


    }

    public backMain() {
        let node = Global.getInstance().gameCanvas.getChildByName("Content").getChildByName('DetailPanel');
        if (node){
            director.getScheduler().unscheduleAllForTarget(node); // 取消targetNode的所有定时器
        }
        director.loadScene("Main",()=>{
            // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main)
        });
    }
    public gameContinue() {

        let self = this;
        function f(leaf:Leaf) {
            if ((leaf.infinity && Global.getInstance().dateToSeconds(leaf.infinity) + 1200 - Global.getInstance().dateToSeconds(Date.now()) >= 0)||leaf.remaining >= 5) {
                consumeLeaf((status)=>{
                    if (status) {

                        self.closeMaskGlobal()
                        LevelDesign.getInstance().init();
                        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game);
                    }
                })

            }else {
                self.backMain();
            }
        }
        getLeaf(f)

    }

    public showPropsTip(title:string,tip:string,resume:Function){
        this.openMaskGlobal();
        let popup = UIManager.getInstance().popupMap.get(PopupEnum.PROPS_PROMPT) as PopupPropsPrompt;
        popup.text = tip;
        popup.title = title;
        popup.resume = resume;
        UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.PROPS_PROMPT);

    }

    public showFistGuide(){
        this.openMaskGuideGlobal();
        let popup = UIManager.getInstance().popupMap.get(PopupEnum.GUIDE) as PopupGuide;
        let guides:Guide[] = [];
        let content = Global.getInstance().gameCanvas.getChildByName("Content");
        let detailPanel = content.getChildByName("DetailPanel");
        let g1p = content.getComponent(UITransform).convertToWorldSpaceAR(detailPanel.getPosition())
        g1p.y = g1p.y-detailPanel.getComponent(UITransform).contentSize.height

        let detail = detailPanel.getChildByName("Detail");
        let width = detail.getComponent(UITransform).width;
        let height = detail.getComponent(UITransform).height;
        let maskPos = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(UITransform).convertToNodeSpaceAR(detail.getWorldPosition());
        guides.push({pos:{x:g1p.x,y:g1p.y},tip:"这是<b>获胜目标</b>哦!",draw:(grp)=>{
                grp.clear()
                grp.lineWidth = 10;
                grp.strokeColor.fromHEX("#d54444");
                grp.rect(maskPos.x - width/2,maskPos.y - height/2,width,height,10)
                grp.stroke();
                grp.fill();
            }});
        if (LevelDesign.getInstance().showGhostDirection) {
            let g2p = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(Global.getInstance().predictCoord.x, Global.getInstance().predictCoord.y))

            let g2p1 = Global.getInstance().playArea.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(g2p.x,g2p.y,0))
            let maskPos = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(UITransform).convertToNodeSpaceAR(g2p1);
            let angle = g2p1.y > Global.getInstance().currentGhostVec2.y?180:0;
            guides.push({pos:{x:g2p1.x,y:g2p1.y},tip:"这是布布的<b>下一步位置</b>哦!",angle:angle,draw:(grp)=>{
                    grp.clear()
                    grp.lineWidth = 10;
                    grp.strokeColor.fromHEX("#d54444");
                    grp.circle(maskPos.x,maskPos.y + 10,LevelDesign.getInstance().currentShapeEnum == ShapeEnum.FOUR? LevelDesign.getInstance().getShapeManager().innerCircleRadius + 10: LevelDesign.getInstance().getShapeManager().innerCircleRadius*2+ 10)
                    grp.stroke();
                    grp.fill();
                }});
        }

        // let gamePros = content.getChildByName("GameProps");
        // let g3p = content.getComponent(UITransform).convertToWorldSpaceAR(gamePros.getPosition())
        // g3p.y = g3p.y + detailPanel.getComponent(UITransform).contentSize.height/2;
        // guides.push({pos:{x:g3p.x,y:g3p.y},tip:"如果觉得困难别忘了使用下方道具呦!",angle:180});


        let view = content.getChildByName("GameProps").getChildByName("ScrollView").getChildByName("view").getChildByName("content");

        let rest = view.getChildByName("障碍物重置");
        let restWidth = rest.getComponent(UITransform).width;
        let g3p = view.getComponent(UITransform).convertToWorldSpaceAR(rest.getPosition())
        let restPos = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(UITransform).convertToNodeSpaceAR(g3p);
        g3p.y = g3p.y + rest.getComponent(UITransform).contentSize.height/2;
        guides.push({pos:{x:g3p.x,y:g3p.y},tip:"初始障碍物分布不满意，可使用此道具重置",angle:180,draw:(grp)=>{
                grp.clear()
                grp.lineWidth = 10;
                grp.strokeColor.fromHEX("#d54444");
                grp.circle(restPos.x,restPos.y,restWidth/2)
                grp.stroke();
                grp.fill();
            }});

        let back = view.getChildByName("后退");

        let backWidth = rest.getComponent(UITransform).width;
        let g4p = view.getComponent(UITransform).convertToWorldSpaceAR(back.getPosition())
        let backPos = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(UITransform).convertToNodeSpaceAR(g4p);
        g4p.y = g4p.y + back.getComponent(UITransform).contentSize.height/2;
        guides.push({pos:{x:g4p.x,y:g4p.y},tip:"不小心走错了，可使用此道具回退",angle:180,draw:(grp)=>{
                grp.clear()
                grp.lineWidth = 10;
                grp.strokeColor.fromHEX("#d54444");
                grp.circle(backPos.x,backPos.y,backWidth/2)
                grp.stroke();
                grp.fill();
            }});

        let freeze = view.getChildByName("冻结");
        let freezeWidth = rest.getComponent(UITransform).width;
        let g5p = view.getComponent(UITransform).convertToWorldSpaceAR(freeze.getPosition())

        let freezePos = UIManager.getInstance().maskGuideGlobal.getChildByName("Mask").getComponent(UITransform).convertToNodeSpaceAR(g5p);
        g5p.y = g5p.y + freeze.getComponent(UITransform).contentSize.height/2;
        guides.push({pos:{x:g5p.x,y:g5p.y},tip:"可使用此道具将布布冻结",angle:180,scaleX:-1,draw:(grp)=>{
                grp.clear()
                grp.lineWidth = 10;
                grp.strokeColor.fromHEX("#d54444");
                grp.circle(freezePos.x,freezePos.y,freezeWidth/2)
                grp.stroke();
                grp.fill();
            }});
        // let gamePros = content.getChildByName("GameProps");
        // let g3p = content.getComponent(UITransform).convertToWorldSpaceAR(gamePros.getPosition())
        // g3p.y = g3p.y + detailPanel.getComponent(UITransform).contentSize.height/2;
        // guides.push({pos:{x:g3p.x,y:g3p.y},tip:"如果觉得困难别忘了使用下方道具呦!",angle:180});


        popup.guides = guides;
        UIManager.getInstance().maskGuideGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.GUIDE);

    }

    public showMapPropsGuide(resume:Function,coord,tip) {
        this.openMaskGuideGlobal()
        let popup = UIManager.getInstance().popupMap.get(PopupEnum.mapPropsGuide) as PopupMapPropsGuide;
        popup.resume = resume;
        let guides:Guide[] = [];
        // let content = Global.getInstance().gameCanvas.getChildByName("Content");
        // if (LevelDesign.getInstance().showGhostDirection) {
            let g2p = LevelDesign.getInstance().getShapeManager().getCenter(new Vec2(coord.x, coord.y))
            let g2p1 = Global.getInstance().playArea.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(g2p.x,g2p.y,0))
            // let angle = g2p1.y > Global.getInstance().currentGhostVec2.y?180:0;
            if (coord.x== LevelDesign.getInstance().getShapeManager().WidthCount - 1) {
                guides.push({pos:{x:g2p1.x,y:g2p1.y},tip:tip,scaleX:-1});
            }else {
                guides.push({pos:{x:g2p1.x,y:g2p1.y},tip:tip});
            }
        // }


        popup.guides = guides;
        UIManager.getInstance().maskGuideGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.mapPropsGuide);
    }

    public pause(){
        this.openMaskGlobal();
        UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.MENU);
    }
    public mainMenu(){
        this.openMaskGlobal();
        UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.MAIN_MENU);
    }

    public openShare(){
        this.openMaskGlobal();
        let popup = UIManager.getInstance().popupMap.get(PopupEnum.SHARE) as PopupPropsPrompt;
        popup.resume = () =>{
            window['wx'].shareAppMessage()
            infinityLeaf((status)=>{
                if (status) {
                    ProcessStateMachineManager.getInstance().putMessage(ProcessStateEnum.main, MainMessage.INIT_LEAF)
                }
            })
        };
        let component = UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup);
        component.init(PopupEnum.SHARE);
    }
    public adapterScale(node:Node){
        let srcScaleForShowAll = Math.min(screen.windowSize.width / node.getComponent(UITransform).contentSize.width, screen.windowSize.height / node.getComponent(UITransform).contentSize.height);
        let realWidth = node.getComponent(UITransform).contentSize.width * srcScaleForShowAll;
        let realHeight = node.getComponent(UITransform).contentSize.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做缩放适配
        node.scale = new Vec3(Math.max(screen.windowSize.width  / realWidth, screen.windowSize.height  / realHeight),Math.max(screen.windowSize.width  / realWidth, screen.windowSize.height  / realHeight),0);
    }

    public adapterContentSize(node:Node) {
        let srcScaleForShowAll = Math.min(screen.windowSize.width / node.getComponent(UITransform).contentSize.width, screen.windowSize.height / node.getComponent(UITransform).contentSize.height);
        let realWidth = node.getComponent(UITransform).contentSize.width * srcScaleForShowAll;
        let realHeight = node.getComponent(UITransform).contentSize.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做节点宽高适配
        node.getComponent(UITransform).setContentSize(node.getComponent(UITransform).contentSize.width * (screen.windowSize.width / realWidth),node.getComponent(UITransform).contentSize.height * (screen.windowSize.height / realHeight));

    }
}
