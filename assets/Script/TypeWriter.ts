import { _decorator, Component, Node,RichText } from 'cc';
import {BulletEnum} from "db://assets/Script/LevelDesign";
const { ccclass, property } = _decorator;

@ccclass('TypeWriter')
export class TypeWriter extends Component {

    contentArray = []
    currentContentIndex=0
    typeIndex=0
    speed:10
    start() {

    }

    begin() {
        this.contentArray.push(BulletEnum.load_tip);
        this.contentArray.push(BulletEnum.load_1);
        this.contentArray.push(BulletEnum.load_2);
        this.contentArray.push(BulletEnum.load_3);
        this.contentArray.push(BulletEnum.load_4);
        let hover = true
        this.schedule(function (){
            if (hover){
                if (this.currentContentIndex >= this.contentArray.length) {
                    this.currentContentIndex = 0
                }
                if (this.typeIndex >= this.contentArray[this.currentContentIndex].length) {
                    hover = false;
                    this.typeIndex = 0
                    this.currentContentIndex++
                    this.scheduleOnce(()=>{hover = true},5)
                    return
                }
                const codePoint = this.contentArray[this.currentContentIndex].codePointAt(this.typeIndex);

                // 对于代理对（Surrogate Pair），跳过第二个代理字符
                if (codePoint > 0xFFFF) {
                    // 更新富文本内容
                    // this.node.getComponent(RichText).string = this.contentArray[this.currentContentIndex].slice(0, this.typeIndex + 2);
                }else {
                    // 更新富文本内容
                    this.node.getComponent(RichText).string = this.contentArray[this.currentContentIndex].slice(0, this.typeIndex + 1);
                }

                this.typeIndex++
            }
        }, 0.2)

    }
    update(deltaTime: number) {
        
    }
}

