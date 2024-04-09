import { _decorator, Component, Node,Button,find,instantiate,director,tween,Vec3 } from 'cc';
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
    private FriendRankBtn:Node = null;
    @property(Node)
    private WorldRankBtn:Node = null;

    @property(Node)
    private BeginBtn: Node = null;

    private isFriendRankProcessingClick = false;
    private isRankProcessingClick = false;

    onLoad() {
        this.FriendRankBtn.on(Button.EventType.CLICK, this.friendRankOnClick, this);
        this.WorldRankBtn.on(Button.EventType.CLICK, this.worldRankOnClick, this);
        this.RankBtn.on(Button.EventType.CLICK, this.rankOnClick, this);
        this.BeginBtn.on(Button.EventType.CLICK, this.begin, this);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
    rankOnClick(){
        if (this.isRankProcessingClick) return;
        this.isRankProcessingClick = true;
        let rankPanel = this.RankBtn.parent.getChildByName("RankPanel");
        if (rankPanel.scale.x == 0) {
            tween(rankPanel)
                .to(0.2,{scale: new Vec3(1.2,1,1)})
                .to(0.1,{scale: new Vec3(1,1,1)})
                .call(()=>{
                    this.FriendRankBtn.scale = new Vec3(1,1,1);
                    this.WorldRankBtn.scale = new Vec3(1,1,1);
                })
                .start();
        }else {
            tween(rankPanel)
                .to(0.2,{scale: new Vec3(0,1,1)})
                .call(()=>{
                    this.FriendRankBtn.scale = new Vec3(0,0,1);
                    this.WorldRankBtn.scale = new Vec3(0,0,1);

                })
                .start();
        }
        setTimeout(() => {
            this.isRankProcessingClick = false;
        }, 500); //
    }
    friendRankOnClick() {
        if (this.isFriendRankProcessingClick) return;
        this.isFriendRankProcessingClick = true;
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
        setTimeout(() => {
            this.isFriendRankProcessingClick = false;
        }, 500); // Adjust the delay as needed
    }
    worldRankOnClick(){
        let canvas = find('Canvas');
        canvas.addChild(instantiate(canvas.getComponent(PrefabController).WorldRankPrefab));


    }
    begin() {
        director.loadScene("Game",()=>{
            // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game)
        });
    }
}

