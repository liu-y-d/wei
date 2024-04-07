
import {find,Node,director} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Global} from "db://assets/Script/Global";
import {UIManager} from "db://assets/Script/UIManager";
export class MainProcessState implements IProcessStateNode {
    readonly key =  ProcessStateEnum.main;

    mainNode = null;

    onExit() {
    }

    onHandlerMessage() {
    }

    onInit() {
        // window['wx'].getUserInteractiveStorage({
        //     keyList :["friendRank"],
        //     success: (res)=>{
        //         console.log(res)
        //     }
        // })
        // window['wx'].setUserCloudStorage({
        //     KVDataList: [{"key":'friendRank', "value": '{"actual_rank":"大神2", "actual_score":"90"}'}]
        //     // KVDataList: [{"key":'friendRank', "value": '19'}]
        // }).then(res=>{
        //     console.log("上传成功")
        // }).catch(err=>{
        // });
        this.simulation();
        LevelDesign.getInstance().init();
        Global.getInstance().propsConfigInit();
        let gameLevel = find('Canvas').getChildByName('GameLevel');
        gameLevel.getComponent(GameLevel).drawCustomer();
        gameLevel.getChildByName("Menu").on(Node.EventType.TOUCH_END, ()=>{
            Global.getInstance().setPlayerInfo({
                playerId:'1',
                nickName:'云达',
                gameLevel:1,
                avatarUrl:null
            })
            UIManager.getInstance().mainMenu();
        }, this);


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
    onUpdate() {
    }

    _listener: { [p: string]: (target, params) => (void | null) };

}
