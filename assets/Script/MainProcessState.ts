
import {find,Node,director} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Global} from "db://assets/Script/Global";
import {UIManager} from "db://assets/Script/UIManager";
import {getCurrentUserGameLevelReq} from "db://assets/Script/Request";
export class MainProcessState implements IProcessStateNode {
    readonly key =  ProcessStateEnum.main;

    mainNode = null;

    onExit() {
    }

    onHandlerMessage() {
    }

    onInit() {

        let my = this;
        let canvas = find('Canvas');

        function init(gameLevel) {
            console.log("gameLevel",gameLevel)
            my.simulation(gameLevel);
            LevelDesign.getInstance().init();
            Global.getInstance().propsConfigInit();
            canvas.getChildByName('BulletScreen').active = true;
            canvas.getChildByName('GameLevel').getComponent(GameLevel).drawCustomer();
            canvas.getChildByName('Top').getChildByName("Menu").on(Node.EventType.TOUCH_END, ()=>{
                UIManager.getInstance().mainMenu();
            }, this);
        }
        canvas.getChildByName('BulletScreen').active = false;

        // 本地调试
        init(5)
        // getCurrentUserGameLevelReq(init);



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

    _listener: { [p: string]: (target, params) => (void | null) };

}
