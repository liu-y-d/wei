import { _decorator, Component, Node, Button,find,Prefab,instantiate,Sprite,Label,assetManager,ImageAsset,SpriteFrame,Texture2D,Color } from 'cc';
import {Global} from "db://assets/Script/Global";
import {getWorldRank} from "db://assets/Script/Request";
import {LevelDesign} from "db://assets/Script/LevelDesign";

const { ccclass, property } = _decorator;

@ccclass('WorldRankController.ts')
export class WorldRankController extends Component {

    @property(Node)
    private closeBtnNode: Node = null;

    @property(Prefab)
    private RankItem: Prefab = null;

    public onLoad() {

        // RankController.instance.node.addChild(instantiate(find('Canvas').getComponent(PrefabController).loading));

        // this.closeBtnNode.on('touchend', RankController.hide, this);
        this.closeBtnNode.on(Button.EventType.CLICK, this.hide, this);
        this.node.getChildByName("Background").on(Node.EventType.TOUCH_START, ()=>{}, this)

        let self = this;

        function renderWorldRank(datas) {

            // for (let i = 0; i < 100; i++) {
            //     datas.push(datas[0])
            // }
            if (datas && datas.length > 0) {
                let content = self.node.getChildByPath("Panel/ScrollView/view/content");
                for (let i = 0; i < datas.length; i++) {
                    let datum = datas[i];
                    let rankItem = instantiate(self.RankItem);

                    let crown = rankItem.getChildByName("Crown");
                    let color = new Color();
                    if (i == 0) {
                        rankItem.getChildByName("Index").active = false
                        crown.active = true;
                        crown.getComponent(Sprite).color = Color.fromHEX(color, '#FFD700')
                    }else if (i== 1) {
                        rankItem.getChildByName("Index").active = false
                        crown.active = true;
                        crown.getComponent(Sprite).color = Color.fromHEX(color, '#C0C0C0')
                    }else if (i==2) {
                        rankItem.getChildByName("Index").active = false
                        crown.active = true;
                        crown.getComponent(Sprite).color = Color.fromHEX(color, '#B87333')
                    }else {
                        rankItem.getChildByName("Index").getComponent(Label).string = i + 1 + ""
                    }
                    rankItem.getChildByName("Username").getComponent(Label).string = datum.username
                    rankItem.getChildByName("Number").getComponent(Label).string = datum.gameLevel + "关"
                    let sp = rankItem.getChildByPath("Avatar/Img").getComponent(Sprite);
                    if (datum.avatar) {
                        assetManager.loadRemote<ImageAsset>(datum.avatar, {ext: '.png'}, function (err, imageAsset) {
                            if (err) {
                                console.log(err)
                                return
                            }
                            const spriteFrame = new SpriteFrame();
                            const texture = new Texture2D();
                            texture.image = imageAsset;
                            spriteFrame.texture = texture;
                            sp.spriteFrame = spriteFrame;
                        });
                    }
                    content.addChild(rankItem);
                }

                let selfRankNum;
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].playerId == Global.getInstance().getPlayerInfo().playerId) {
                        selfRankNum =  i + 1;
                        break;
                    }
                }

                let selfNode = self.node.getChildByPath("Panel/Self");
                selfNode.getChildByName("Index").getComponent(Label).string = selfRankNum?selfRankNum:"未上榜"
                selfNode.getChildByName("Username").getComponent(Label).string = Global.getInstance().getPlayerInfo().nickName
                selfNode.getChildByName("Number").getComponent(Label).string = Global.getInstance().getPlayerInfo().gameLevel - 1 <0 ? '--': Global.getInstance().getPlayerInfo().gameLevel - 1+ "关"
                let sp = selfNode.getChildByPath("Avatar/Img").getComponent(Sprite);
                if (Global.getInstance().getPlayerInfo().avatarUrl) {
                    assetManager.loadRemote<ImageAsset>(Global.getInstance().getPlayerInfo().avatarUrl, {ext: '.png'}, function (err, imageAsset) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        const spriteFrame = new SpriteFrame();
                        const texture = new Texture2D();
                        texture.image = imageAsset;
                        spriteFrame.texture = texture;
                        sp.spriteFrame = spriteFrame;
                    });
                }


                self.node.getChildByName("LoadingPanel").active = false;
                self.node.getChildByName("Panel").active = true;

            }
        }


        getWorldRank(renderWorldRank)


        // let datas = [{
        // avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/t3CJeicp0rMiazAos6w9V6DZqBTiaYlVYDicMDFH3FZGcefEfkxaPE2WODlODTkVgdI9nQYA4VEoQx1syOhibL3bflnsL44xEGpXj0gV1icVYl9dQ/132",
        // gameLevel: 5,
        // playerId: "oCe_s0BUXGMmbfx30iYe8QzFMT4k",
        // username: "666🥲"
        // }]
        // renderWorldRank(datas)
    }


    public hide() {
        // this.node.removeFromParent();
        this.node.active = false;
    }

    update () {
        // console.log(RankController.instance.node.getChildByName('WXSubContentView'))
        // if (RankController.instance.node.getChildByName('WXSubContentView').getComponent(Sprite).spriteFrame!=null) {
        //     let loading = RankController.instance.node.getChildByName('Loading');
        //     if (loading) {
        //         loading.removeFromParent();
        //     }
        // }
    }
    /**
     * 设置用户的分数
     * @param value
     */
    // public static setScore(value: number) {
    //     const wx = window['wx'];
    //     wx.postMessage({
    //         event: 'setScore',
    //         score: value
    //     });
    // }
    //
    // /**
    //  * 获取排行榜
    //  */
    // public static getRank() {
    //     const wx = window['wx'];
    //     wx.postMessage({
    //         event: 'getRank'
    //     });
    // }
}

