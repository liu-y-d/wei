import { _decorator, Component, Node, Button,find,Prefab,instantiate,Sprite } from 'cc';
import {Global} from "db://assets/Script/Global";

const { ccclass, property } = _decorator;

@ccclass('WorldRankController.ts')
export class WorldRankController extends Component {

    @property(Node)
    private closeBtnNode: Node = null;

    public onLoad() {

        // RankController.instance.node.addChild(instantiate(find('Canvas').getComponent(PrefabController).loading));

        // this.closeBtnNode.on('touchend', RankController.hide, this);
        this.closeBtnNode.on(Button.EventType.CLICK, this.hide, this);
        this.node.getChildByName("Background").on(Node.EventType.TOUCH_START, ()=>{}, this)

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

