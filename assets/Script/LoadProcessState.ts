
import { director,find, sys,Node} from "cc";
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import CommonProgressBar from "db://assets/Script/CommonProgressBar";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {AudioMgr} from "db://assets/Script/AudioMgr";
import {Global} from "db://assets/Script/Global";
import {TypeWriter} from "db://assets/Script/TypeWriter";

export class LoadProcessState implements IProcessStateNode {
    readonly key = ProcessStateEnum.load;
    onInit () {
        // let channel = new NetChannel({
        //     url: 'ws://127.0.0.1:9000/rps-game/game',
        //     heartInterval: 1000,
        //     receiveTimeOutInterval: 6000,
        //     reconnectInterval: 3000,
        //     autoReconnect: 3
        // });
        // channel.init(new CWebSocket(),null,()=>{director.loadScene("Main",()=>{ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main);})});
        // channel.setResponeHandler(0, (code: number, data: TData) => {
        //
        // });
        // director.loadScene("Main",()=>{ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main)});
        let progressBarNode = find('Canvas/Content/ProgressBar');
        let progressBar = progressBarNode.getComponent(CommonProgressBar);
        find('Canvas/Content/TypeWriter').getComponent(TypeWriter).begin();
        director.preloadScene("Main", (completedCount, totalCount, item) =>{
            progressBar.prevNum = progressBar.num;
            progressBar.num = completedCount / totalCount;
            progressBar.show();
        }, function(){
            progressBar.hide();
            ProcessStateMachineManager.getInstance().change(ProcessStateEnum.login);
            // if (sys.platform === sys.Platform.WECHAT_GAME) {
            //     ProcessStateMachineManager.getInstance().change(ProcessStateEnum.login);
            // }else {
            // }
        })
    }
    onExit() {

    }
    onUpdate() {

    }
    onHandlerMessage() {

    }

    _listener: { [p: string]: (target, params) => (void | null) };


    //预加载场景并获得加载进度
    // director.preloadScene('Game', function (completedCount, totalCount, item) {
    //     //可以把进度数据打出来
    //     progressBar.num = completedCount / totalCount;
    //     progressBar.show();
    // }, function () {
    //     progressBar.hide();
    //     //加载场景
    //     cc.director.loadScene("Game", function (a, b, c) {
    //         СameraСontrol.newGame();
    //     });
    // });
    // onProgress (completedCount, totalCount, item){
    //     progressBar.num = completedCount / totalCount;
    //     progressBar.show();
    //
    //     // this.loader.string = Math.floor(completedCount/totalCount * 100) + "%";
    //
    // }
}