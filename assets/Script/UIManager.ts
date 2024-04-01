import {Node,director,instantiate,find,Label,game,Director,resources,Prefab,screen,UITransform,Vec3} from "cc";
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
import {gameOverReq} from "db://assets/Script/Request";

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
    MENU
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
            this.popupMap.set(popupGameOver.type,popupGameOver);
            this.popupMap.set(propsPrompt.type,propsPrompt);
            this.popupMap.set(popupMenu.type,popupMenu);
        }

    }
    /**
     * 全局遮罩
     */
    maskGlobal:Node;

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

    public gameOver(state:GameStateEnum) {
        // 目前单机
        // window['wx'].setUserCloudStorage({
        //     KVDataList: [{"key":'friendRank', "value": `{"actual_rank":"大神1", "actual_score":"${LevelDesign.getInstance().currentLevel}"}`}]
        //     // KVDataList: [{"key":'friendRank', "value": '19'}]
        // }).then(res=>{
        //     console.log("上传成功")
        // }).catch(err=>{
        // });
        let orgLevel = Global.getInstance().getPlayerInfo().gameLevel

        let my = this
        gameOverReq(orgLevel,state,(addStatus)=>{
            if (addStatus) {
                if (state == GameStateEnum.win) {
                    Global.getInstance().playerNext();
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
        director.loadScene("Main");
    }
    public gameContinue() {
        this.closeMaskGlobal()
        LevelDesign.getInstance().init();
        ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game);
    }

    public showPropsTip(tip:string,resume:Function){
        this.openMaskGlobal();
        let popup = UIManager.getInstance().popupMap.get(PopupEnum.PROPS_PROMPT) as PopupPropsPrompt;
        popup.text = tip;
        popup.resume = resume;
        UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.PROPS_PROMPT);

    }

    public pause(){
        this.openMaskGlobal();
        UIManager.getInstance().maskGlobal.getChildByName('Popup').getComponent(Popup).init(PopupEnum.MENU);
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
