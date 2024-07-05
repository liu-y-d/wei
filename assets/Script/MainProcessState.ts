
import {find,Node,Label,director,ProgressBar,UITransform,ParticleSystem2D} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Global} from "db://assets/Script/Global";
import {UIManager} from "db://assets/Script/UIManager";
import {getCurrentUserGameLevelReq, GetGlobalPropsConfig, getLeaf, Leaf} from "db://assets/Script/Request";
import {InfinityLeafScheduleAdapter} from "db://assets/Script/InfinityLeafScheduleAdapter";
import {GhostMessage} from "db://assets/Script/GhostState";
import {TollGateComponent} from "db://assets/Script/TollGateComponent";
export class MainProcessState implements IProcessStateNode {
    readonly key =  ProcessStateEnum.main;


    _listener: { [p: string]: (target, params) => (void | null) } = {};
    mainNode = null;

    onExit() {
    }

    onHandlerMessage(code: string, params) {
        this._listener[code](this, params);
    }

    onInit() {

        this._listener[MainMessage.INIT_LEAF] = this.initLeaf;
        let my = this;
        let canvas = find('Canvas');

        function init(gameLevel) {
            my.simulation(gameLevel);
            my.initLeaf()
            GetGlobalPropsConfig()
            LevelDesign.getInstance().init();
            Global.getInstance().propsConfigInit();
            canvas.getChildByPath('Content/TollGate').getComponent(TollGateComponent).initTollGate(gameLevel)
            // canvas.getChildByPath('Content/BulletScreen').active = true;
            // canvas.getChildByPath('Content/GameLevel').getComponent(GameLevel).drawCustomer();
            canvas.getChildByPath('Content/Top').getChildByName("Menu").on(Node.EventType.TOUCH_END, ()=>{
                UIManager.getInstance().mainMenu();
            }, this);
        }
        // canvas.getChildByPath('Content/BulletScreen').active = false;

        // 本地调试
        // init(5)
        getCurrentUserGameLevelReq(init);



    }

    // initGlobalProps(){
    //
    // }
    initLeaf(){

        let canvas = find('Canvas');
        function callBack(leaf:Leaf) {
            let power = canvas.getChildByPath("Content/Top/Power");
            // power.getChildByName("PowerNum").getComponent(Label).string = leaf.infinity?'MAX':`${leaf.remaining}`
            // power.getChildByName("PowerNum").getComponent(Label).string = leaf.infinity?'MAX':`${leaf.remaining}`
            let progress = power.getChildByName("Progress");
            progress.on(Node.EventType.TOUCH_END,()=>{
                UIManager.getInstance().openShare()
            },this)
            let leafFly = canvas.getChildByPath("Content/LeafFly");
            leafFly.active = false;
            if (leaf.infinity) {
                let seconds = Global.getInstance().dateToSeconds(leaf.infinity);
                if (seconds + 1200 - Global.getInstance().dateToSeconds(Date.now()) >= 0) {
                    // power.getChildByName("Time").active = true;
                    // power.getChildByName("Time").getComponent(Label).string = leaf.infinity
                    let component = power.getChildByName("PowerNum").getComponent(InfinityLeafScheduleAdapter);
                    progress.getComponent(ProgressBar).progress = 1
                    component.countDown(seconds,()=>{
                        power.getChildByName("PowerNum").getComponent(Label).string = `${leaf.remaining}/100`
                    });
                    leafFly.setPosition(canvas.getChildByName("Content").getComponent(UITransform).convertToNodeSpaceAR(power.getChildByName("Leaf").getWorldPosition()))
                    leafFly.active=true;
                }else {
                    power.getChildByName("PowerNum").getComponent(Label).string = `${leaf.remaining}/100`
                    if (leaf.remaining > 0) {
                        progress.getComponent(ProgressBar).progress = leaf.remaining/100
                        leafFly.setPosition(canvas.getChildByName("Content").getComponent(UITransform).convertToNodeSpaceAR(power.getChildByName("Leaf").getWorldPosition()))
                        leafFly.active=true;
                        leafFly.getComponent(ParticleSystem2D).resetSystem();
                    }else {
                        progress.getComponent(ProgressBar).progress = 0
                        leafFly.active = false;
                        leafFly.getComponent(ParticleSystem2D).stopSystem();
                    }
                }


            }else {
                power.getChildByName("PowerNum").getComponent(Label).string = `${leaf.remaining}/100`
                if (leaf.remaining > 0) {
                    progress.getComponent(ProgressBar).progress = leaf.remaining/100
                    leafFly.setPosition(canvas.getChildByName("Content").getComponent(UITransform).convertToNodeSpaceAR(power.getChildByName("Leaf").getWorldPosition()))
                    leafFly.active=true;
                    leafFly.getComponent(ParticleSystem2D).resetSystem();
                }else {
                    progress.getComponent(ProgressBar).progress = 0
                    leafFly.active = false;
                    leafFly.getComponent(ParticleSystem2D).stopSystem();
                }
            }
        }
        getLeaf(callBack)
    }



    simulation(gameLevel) {
        let info = Global.getInstance().getPlayerInfo();
        if (!info) {
            info = {
                playerId:'1',
                nickName:'云达',
                gameLevel:gameLevel + 1,
                avatarUrl:null
            }
            Global.getInstance().setPlayerInfo(info)
        }else {
            info.gameLevel = gameLevel + 1
            Global.getInstance().setPlayerInfo(info)
        }

        // LevelDesign.getInstance().showGhostDirection = true;
        // LevelDesign.getInstance().init();
    }
    onUpdate() {
    }



}
export enum MainMessage {
    INIT_LEAF = "INIT_LEAF"
}
