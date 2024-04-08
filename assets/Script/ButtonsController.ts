import { _decorator, Component, Node,Button,find,instantiate,director } from 'cc';
import {PrefabController} from "db://assets/Script/PrefabController";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {RankController} from "db://assets/Script/RankController";
const { ccclass, property } = _decorator;

@ccclass('ButtonsController')
export class ButtonsController extends Component {

    @property(Node)
    private RankBtn:Node = null;

    @property(Node)
    private CreateCustomBtn: Node = null;

    onLoad() {
        this.RankBtn.on(Button.EventType.CLICK, this.rankOnClick, this);
        this.CreateCustomBtn.on(Button.EventType.CLICK, this.begin, this);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
    rankOnClick() {

        window['wx'].getUserInteractiveStorage({
            keyList :["friendRank"],
            success: (res)=>{
                console.log(res)
                let canvas = find('Canvas');
                canvas.addChild(instantiate(canvas.getComponent(PrefabController).rankPrefab));
            },
            fail: (res)=>{
                // 检查授权状态
                window['wx'].getSetting({
                    success(res) {
                        console.log(res)
                        if (!res.authSetting['scope.getUserInteractiveStorage']) {
                            // 授权被拒绝
                            window['wx'].showModal({
                                title: '提示',
                                content: '需要授权微信朋友信息，请确认授权',
                                success: function(modalRes) {
                                    if (modalRes.confirm) {
                                        // 引导用户去设置页重新授权
                                        window['wx'].openSetting({
                                            success: function(settingRes) {
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        })




    }
    begin() {
        director.loadScene("Game",()=>{
            // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game)
        });
    }
}

