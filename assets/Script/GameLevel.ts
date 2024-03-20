import {_decorator, Component, Graphics, Label,Vec2,Sprite,Color,Node,find,UITransform} from 'cc';
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";
import {Global} from "db://assets/Script/Global";
import {ShapeEnum} from "db://assets/Script/ShapeManager";

const { ccclass, property } = _decorator;

@ccclass('GameLevel')
export class GameLevel extends Component {

    public bulletPool:Node[] = [];
    // start() {
    //     this.drawCustomer()
    // }

    drawCustomer() {
        this.initTitle();
        switch (LevelDesign.getInstance().getShapeManager().shapeEnum) {
            case ShapeEnum.FOUR:
                if (LevelDesign.getInstance().difficultyLevel == DifficultyLevelEnum.Hard) {
                    this.initShapeFourEightDirection();
                }else {
                    this.initShapeFour();
                }
                break;
            case ShapeEnum.SIX:
                this.initShapeSix();
                break;
        }
    }
    initShapeFour() {
        let detail = this.node.getChildByName('Detail');
        const graphics = detail.getComponent(Graphics);
        graphics.clear();
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
    initShapeFourEightDirection() {
        let detail = this.node.getChildByName('Detail');
        const graphics = detail.getComponent(Graphics);
        graphics.clear();
        let edgeLength = 100;
        // 开始新的绘制路径
        // graphics.beginPath();

        // 绘制矩形，参数为左上角坐标x, y以及宽度width和高度height
        graphics.roundRect(-edgeLength/2, -edgeLength/2, edgeLength, edgeLength,10);

        graphics.roundRect(-edgeLength/2 + edgeLength +10, -edgeLength/2 + edgeLength +10, edgeLength, edgeLength,10);
        graphics.roundRect(-edgeLength/2 - edgeLength -10, -edgeLength/2 + edgeLength +10, edgeLength, edgeLength,10);
        graphics.roundRect(-edgeLength/2 - edgeLength -10, -edgeLength/2 - edgeLength -10, edgeLength, edgeLength,10);
        graphics.roundRect(-edgeLength/2 + edgeLength +10, -edgeLength/2 - edgeLength -10, edgeLength, edgeLength,10);

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

        let detail = this.node.getChildByName('Detail');
        const graphics = detail.getComponent(Graphics);
        graphics.clear();
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
        let bgColor = new Color();
        Color.fromHEX(bgColor,difficultyInfo.bgColor);
        let childByName = find('Canvas').getChildByName('DifficultyLevel');
        childByName.getComponent(Sprite).color = bgColor;
        let fontColor = new Color();
        Color.fromHEX(fontColor,difficultyInfo.fontColor);
        childByName.getChildByName('Label').getComponent(Label).string = difficultyInfo.description;
        childByName.getChildByName('Label').getComponent(Label).color = fontColor;

    }
    update(deltaTime: number) {

    }
}

