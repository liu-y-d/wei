import {_decorator, Component, Graphics, Label,Vec2,Sprite,Color,Node,find,UITransform} from 'cc';
import {LevelDesign} from "db://assets/Script/LevelDesign";
import {Global} from "db://assets/Script/Global";
import {ShapeEnum} from "db://assets/Script/ShapeManager";
import {BulletNode} from "db://assets/Script/BulletNode";

const { ccclass, property } = _decorator;

@ccclass('GameLevel')
export class GameLevel extends Component {

    public bulletPool:Node[] = [];
    start() {
        this.initBulletScreen();
    }

    drawCustomer() {
        this.initTitle();
        switch (LevelDesign.getInstance().getShapeManager().shapeEnum) {
            case ShapeEnum.FOUR:
                this.initShapeFour();
                break;
            case ShapeEnum.SIX:
                this.initShapeSix();
                break;
        }
        this.initBulletScreen();
    }
    initBulletScreen(){
        // let bullets = LevelDesign.getInstance().bulletArray;
        let bullets = ["123123","adsfafsdafsd","asdfasdbbhnserywer"];
        let bulletScreen = find('Canvas').getChildByName('BulletScreen');
        // 初始化弹幕池
        for (let i = 0; i < 3; i++) { // 根据需要创建一定数量的备用弹幕节点
            const node = new Node();
            node.addComponent(BulletNode);
            node.addComponent(UITransform);
            node.addComponent(Label);
            node.getComponent(UITransform).anchorX = 1
            this.bulletPool.push(node);
            bulletScreen.addChild(node);
            node.active = false;
            // node.setSiblingIndex(99999999);
        }
        console.log(bulletScreen)
        let y = 80
        this.schedule(()=>{
            for (let i = 0; i < bullets.length; i++) {
                // 获取一个可用的弹幕节点
                let bulletNode = this.bulletPool.find((node) => !node.active);
                if (!bulletNode) {
                    console.warn('弹幕池已满，无法发送新的弹幕');
                    return;
                }

                // 开始滚动
                bulletNode.getComponent(BulletNode).startScrolling(bullets[i], 720,y);
                if (y < -80) {
                    y = 80
                }else {
                    y -= 50;
                }

            }
        },1);


    }
    initShapeFour() {
        let detail = this.node.getChildByName('Detail');
        const graphics = detail.getComponent(Graphics);
        let edgeLength = 100;
        // 开始新的绘制路径
        // graphics.beginPath();

        // 绘制矩形，参数为左上角坐标x, y以及宽度width和高度height
        graphics.roundRect(-edgeLength/2, -edgeLength/2, edgeLength, edgeLength,10);

        graphics.roundRect(-edgeLength/2 + edgeLength +10, -edgeLength/2, edgeLength, edgeLength,10);
        graphics.roundRect(-edgeLength/2 - edgeLength -10, -edgeLength/2, edgeLength, edgeLength,10);
        graphics.roundRect(-edgeLength/2 , -edgeLength/2- edgeLength -10, edgeLength, edgeLength,10);
        graphics.roundRect(-edgeLength/2 , -edgeLength/2+ edgeLength +10, edgeLength, edgeLength,10);

        // 结束当前路径并填充或描边
        graphics.fill();
        // 或者如果你想只描边不填充
        graphics.stroke();
    }
    initShapeSix() {
        let shapeCenterArray = new Array<Vec2>()
        let outerRadius = 50;
        let x = 0,y = 0;
        shapeCenterArray.push(new Vec2(x,y));

        shapeCenterArray.push(new Vec2(0,0));
        let hexagonCenters1 = this.getCirclePoints(0,0,110);
        console.log(hexagonCenters1)

        let detail = this.node.getChildByName('Detail');
        const graphics = detail.getComponent(Graphics);
        this.drawShapeSix(graphics,new Vec2(0,0),50,this.hex_corner)
        for (let i = 0; i < hexagonCenters1.length; i++) {
            this.drawShapeSix(graphics,new Vec2(hexagonCenters1[i].x,hexagonCenters1[i].y),50,this.hex_corner)
        }
    }
    hex_corner(center, size, i) {
        // var angle_deg = 60 * i + (this.layout ===0?30:0);
        var angle_deg = 60 * i;
        var angle_rad = Math.PI / 180 * angle_deg
        return new Vec2 (center.x + size * Math.cos(angle_rad),
            center.y + size * Math.sin(angle_rad))
    }
    getCirclePoints(centerX, centerY, radius) {
        const points = [];
        for (let angle = 90; angle <= 450; angle += 60) {
            const x = centerX + radius * Math.cos(angle * Math.PI / 180);
            const y = centerY + radius * Math.sin(angle * Math.PI / 180);
            points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
        }
        return points;
    }


    drawShapeSix(graphics:Graphics,center:Vec2,outerRadius,hex_corner:Function){
        console.log(center)
        graphics.lineWidth = 0;
        // var hexagonWidth=HexagonManager.hexagonWidth-7;
        // var hexagonheight=hexagonWidth * 0.866;
        //一边
        let p0 = hex_corner(center,outerRadius,0);
        graphics.moveTo(p0.x, p0.y);

        let p1 = hex_corner(center,outerRadius,1);

        graphics.lineTo(p1.x, p1.y);

        let p2 = hex_corner(center,outerRadius,2);
        graphics.lineTo(p2.x, p2.y);
        let p3 = hex_corner(center,outerRadius,3);
        graphics.lineTo(p3.x, p3.y);

        let p4 = hex_corner(center,outerRadius,4);
        graphics.lineTo(p4.x, p4.y);

        let p5 = hex_corner(center,outerRadius,5);
        graphics.lineTo(p5.x, p5.y);
        graphics.lineTo(p0.x,p0.y );

        // ctx.circle(px,py,hexagonheight);
        // ctx.strokeColor.fromHEX("#363333")
        // ctx.circle(px,py,HexagonManager.hexagonWidth);
        graphics.stroke();
        //4边
        // ctx.fillColor.fromHEX("#8CBDB9")
        graphics.fill();
    }
    initTitle() {
        this.node.getChildByName('Title').getComponent(Label).string = `第 ${Global.getInstance().getPlayerInfo().gameLevel} 关`;
        let difficultyInfo = LevelDesign.getInstance().getDifficultyInfo();
        console.log(Global.getInstance().getPlayerInfo())
        console.log(difficultyInfo)
        console.log(LevelDesign.getInstance())
        let bgColor = new Color();
        Color.fromHEX(bgColor,difficultyInfo.bgColor);
        let childByName = this.node.getChildByName('DifficultyLevel');
        childByName.getComponent(Sprite).color = bgColor;
        let fontColor = new Color();
        Color.fromHEX(fontColor,difficultyInfo.fontColor);
        childByName.getChildByName('Label').getComponent(Label).string = difficultyInfo.description;
        childByName.getChildByName('Label').getComponent(Label).color = fontColor;

    }
    update(deltaTime: number) {
        
    }
}

