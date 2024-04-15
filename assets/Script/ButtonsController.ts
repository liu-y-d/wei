import {_decorator, Button, Component, director, find, instantiate, Node, tween, UITransform, Vec3} from 'cc';
import {PrefabController} from "db://assets/Script/PrefabController";
import {consumeLeaf, getLeaf, Leaf} from "db://assets/Script/Request";
import {Global} from "db://assets/Script/Global";

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
    private isBeginProcessingClick = false;

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
                    this.FriendRankBtn.active = true;
                    this.WorldRankBtn.active = true;
                })
                .start();
        }else {
            tween(rankPanel)
                .to(0.2,{scale: new Vec3(0,1,1)})
                .call(()=>{
                    this.FriendRankBtn.active = false;
                    this.WorldRankBtn.active = false;

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
                let childByName = canvas.getChildByName("RankPanel");
                if (childByName) {
                    childByName.active = true;
                }else {
                    canvas.addChild(instantiate(canvas.getComponent(PrefabController).rankPrefab));
                }
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
        let childByName = canvas.getChildByName("RankPanelWorld");
        if (childByName) {
            // childByName.removeFromParent();
            childByName.active = true;
        }else {

            canvas.addChild(instantiate(canvas.getComponent(PrefabController).WorldRankPrefab));
        }


    }
    begin() {
        if (this.isBeginProcessingClick) return;
        this.isBeginProcessingClick = true;
        function f(leaf:Leaf) {
            if (leaf.infinity && Global.getInstance().dateToSeconds(leaf.infinity) + 1200 - Global.getInstance().dateToSeconds(Date.now()) >= 0) {
                // 无限体力
                let canvas = find('Canvas');
                let power = canvas.getChildByPath("Top/Power");
                let leafFly = power.getChildByName("LeafFly");
                let leafSlot = canvas.getChildByPath("Buttons/Begin/LeafSlot");
                let convertToNodeSpaceAR = leafFly.getComponent(UITransform).convertToNodeSpaceAR(leafSlot.getWorldPosition());
                tween(leafFly).to(0.5,{position:convertToNodeSpaceAR}).call(()=>{
                    let beginLeafFly = leafSlot.getChildByName("LeafFly");
                    beginLeafFly.active=true;
                    tween(beginLeafFly).to(0.1,{scale:new Vec3(1,1,1)}).call(()=>{}).start();

                    director.loadScene("Game",()=>{
                        // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game)
                    });
                }).start()
            }
            if (leaf.remaining >= 5) {
                consumeLeaf((status)=>{
                    if (status) {
                        let canvas = find('Canvas');
                        let power = canvas.getChildByPath("Top/Power");
                        let leafFly = power.getChildByName("LeafFly");
                        let leafSlot = canvas.getChildByPath("Buttons/Begin/LeafSlot");
                        let convertToNodeSpaceAR = leafFly.getComponent(UITransform).convertToNodeSpaceAR(leafSlot.getWorldPosition());
                        tween(leafFly).to(0.5,{position:convertToNodeSpaceAR}).call(()=>{
                            let beginLeafFly = leafSlot.getChildByName("LeafFly");
                            beginLeafFly.active=true;
                            tween(beginLeafFly).to(0.5,{scale:new Vec3(1,1,1)}).call(()=>{}).start();

                            director.loadScene("Game",()=>{
                                // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.game)
                            });
                        }).start()
                    }
                })

            }
        }
        getLeaf(f)

        setTimeout(() => {
            this.isBeginProcessingClick = false;
        }, 1000); // Adjust the delay as needed




    }
}

