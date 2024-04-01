import maskLayer from './maskLayer';
const HANG_MAX = 8;
import { _decorator, Component, Node,Label,UITransform,Vec3,View } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class guideCtrl extends Component {
    @property(Node)
    totalNode:Node = null;

    @property(Node)
    tipTextBack:Node = null;

    @property(Label)
    tipText:Label = null;

    @property(maskLayer)
    maskLayer:maskLayer = null;

    followNode:Node = null;

    Show(text:string,node:Node,extHight:number){
        this.maskLayer.initStencil(node,extHight);
        let hang = Math.ceil(text.length/HANG_MAX);
        let textCombine = '';
        let tmepText = text;
        this.followNode = node;
        if(hang==1){
            textCombine = text;
        }
        else{
            textCombine = text.slice(0,HANG_MAX-2)+'\n';
            tmepText = text.slice(HANG_MAX-2);
        }
        for(let i=0;i<hang-1;i++){
            let end = (i+1)*HANG_MAX;
            if(end>tmepText.length){end = tmepText.length;}
            textCombine+=tmepText.slice(i*HANG_MAX,end);
            if(i!=hang-2){textCombine+='\n';}
        }
        this.tipText.string = textCombine;
        let contentSize = this.tipTextBack.getComponent(UITransform).contentSize;
        if(hang==1){
            this.tipTextBack.getComponent(UITransform).contentSize
            this.tipTextBack.getComponent(UITransform).setContentSize((text.length+2)*this.tipText.fontSize,contentSize.height);
        }
        else{
            this.tipTextBack.getComponent(UITransform).setContentSize((HANG_MAX+2)*this.tipText.fontSize,(hang+2)*this.tipText.fontSize);
        }

        if(this.followNode==null){
            this.totalNode.setPosition(new Vec3(0,300,0));
            this.totalNode.active = true;
            return ;
        }
    }

    update(){
        if(this.followNode==null){
            return ;
        }
        let node = this.followNode;
        let pos = node.parent.getComponent(UITransform).convertToWorldSpaceAR(node.position);
        let localpos = this.totalNode.parent.getComponent(UITransform).convertToNodeSpaceAR(pos);
        this.totalNode.setPosition(localpos);
        this.totalNode.active = true;

        let winsize = View.instance.getVisibleSize();
        if(localpos.y>winsize.height/4){
            this.totalNode.scale = new Vec3(1,-1,1);
            this.tipText.node.scale = new Vec3(1,-1,1);
        }
        else{
            this.totalNode.scale = new Vec3(1,1,1);
            this.tipText.node.scale = new Vec3(1,1,1);
        }

        if(localpos.x>(winsize.width/2-this.tipTextBack.getComponent(UITransform).width/2)){
            this.tipTextBack.getPosition().x=winsize.width/2-this.tipTextBack.getComponent(UITransform).width/2-localpos.x;
        }
        else if(localpos.x<(-winsize.width/2+this.tipTextBack.getComponent(UITransform).width/2)){
            this.tipTextBack.getPosition().x=-winsize.width/2+this.tipTextBack.getComponent(UITransform).width/2-localpos.x;
        }
        else{
            this.tipTextBack.getPosition().x= 0 ;
        }
    }
}