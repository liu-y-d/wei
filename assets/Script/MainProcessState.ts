
import {find} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Global} from "db://assets/Script/Global";
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
        console.log(123123)
        LevelDesign.getInstance().init();
        console.log(Global.getInstance().getPlayerInfo())
        find('Canvas').getChildByName('GameLevel').getComponent(GameLevel).drawCustomer();
    }

    onUpdate() {
    }

    _listener: { [p: string]: (target, params) => (void | null) };

}