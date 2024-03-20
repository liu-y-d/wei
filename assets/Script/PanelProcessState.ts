
import {Node,Graphics,Vec2,Label,instantiate,tween} from 'cc';
import {IProcessStateNode} from "db://assets/Script/IProcessStateNode";
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {GameLevel} from "db://assets/Script/GameLevel";
import {Global} from "db://assets/Script/Global";
import {UIManager} from "db://assets/Script/UIManager";
import {PrefabController} from "db://assets/Script/PrefabController";
export class PanelProcessState implements IProcessStateNode {
    readonly key =  ProcessStateEnum.panel;

    mainNode = null;

    onExit() {
    }

    onHandlerMessage() {
    }

    onInit() {

        // if (!Global.getInstance().panelInfo) {
            Global.getInstance().panelInfo = Global.getInstance().gameCanvas.getChildByName("PanelInfo");
        // }
        this.drawMovableDirection();

        this.levelInfoInit();
    }

    levelInfoInit(){
        let levelInfo = Global.getInstance().panelInfo.getChildByName("LevelInfo");
        levelInfo.getChildByName("Label").getComponent(Label).string = `第${Global.getInstance().getPlayerInfo().gameLevel}关`;
        levelInfo.getChildByName("Pause").on(Node.EventType.TOUCH_END, ()=>{
            UIManager.getInstance().pause();
        }, this);
    }
    // drawMovableDirection() {
    //     let angle = 360/LevelDesign.getInstance().currentMovableDirection;
    //     let movableDirection = Global.getInstance().panelInfo.getChildByName('MovableDirection');
    //     let ctx = movableDirection.getComponent(Graphics);
    //     ctx.clear()
    //     let length = 40;
    //     for (let i = 0; i <= LevelDesign.getInstance().currentMovableDirection; i++) {
    //
    //         ctx.moveTo(0,0);
    //         var angleInRadians = (i*angle + 90) * Math.PI / 180;
    //         let x = length * Math.cos(angleInRadians);
    //         let y = length * Math.sin(angleInRadians);
    //         ctx.lineTo(x,y);
    //
    //         // 画箭头部分，假设箭头长度为10，宽度为5，根据直线方向计算箭头指向
    //         var arrowLength = 10;
    //         var arrowWidth = 10;
    //         // var angle1 = Math.atan2(y, x);
    //         var angle1 = angleInRadians;
    //         var tip = new Vec2(x + arrowLength * Math.cos(angle1), y + arrowLength * Math.sin(angle1));
    //         var side1 = new Vec2(x + arrowWidth * Math.cos(angle1 - Math.PI / 2), y + arrowWidth * Math.sin(angle1 - Math.PI / 2));
    //         var side2 = new Vec2(x + arrowWidth * Math.cos(angle1 + Math.PI / 2), y+ arrowWidth * Math.sin(angle1 + Math.PI / 2));
    //
    //         // 闭合三角形以形成箭头头部
    //         ctx.moveTo(x, y);
    //         ctx.lineTo(side1.x, side1.y);
    //         ctx.lineTo(tip.x, tip.y);
    //         ctx.lineTo(side2.x, side2.y);
    //         ctx.lineTo(x, y);
    //         ctx.stroke();
    //         ctx.fill();
    //     }
    // }
    drawMovableDirection() {
        let star;
        let movableDirection = Global.getInstance().panelInfo.getChildByName('MovableDirection');
        if (LevelDesign.getInstance().currentMovableDirection == 4){
            star = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).Star_4);
        }else if (LevelDesign.getInstance().currentMovableDirection == 6) {
            star = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).Star_6);
        }else {
            star = instantiate(Global.getInstance().gameCanvas.getComponent(PrefabController).Star_8);
        }
        movableDirection.removeAllChildren();
        movableDirection.addChild(star)
        star.setPosition(0,0)
        let angle = 360/LevelDesign.getInstance().currentMovableDirection;

        let zixuan = tween(star);
        for (let i = 1; i <= LevelDesign.getInstance().currentMovableDirection; i++) {
            zixuan.to(0.5,{angle:angle * i})
        }
        zixuan.start();

    }
    onUpdate() {
    }

    _listener: { [p: string]: (target, params) => (void | null) };

}
