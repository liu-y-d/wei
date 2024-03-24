import { _decorator, Component, Node,ProgressBar,Label } from 'cc'
const { ccclass, property } = _decorator;
@ccclass('CommonProgressBar')
export default class CommonProgressBar extends Component {
    num = 0;//进度数据
    prevNum = 0;//进度数据
    isShow = false;//是否显示
    show() {
        //显示
        this.isShow = true;
        this.node.active = true;
    }
    hide() {
        //隐藏
        this.isShow = false;
        this.node.active = false;
    }
    update() {
        let progressBar = this.node.getComponent(ProgressBar);
        if (this.num > this.prevNum) {
            progressBar.progress = this.num;//更新进度条ui的图
            // this.node.getChildByName('Bar').getComponent(Label).string= Math.trunc(this.num*100)+'%';//更新进度条文字

        }
    }
}