import { _decorator, Component, Node,Graphics,Vec2,Label,EventTouch,UITransform } from 'cc';
import {Hexagon} from "db://assets/Script/Hexagon";
import {HexagonManager} from "db://assets/Script/HexagonManager";
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {

    hexagon:Hexagon;

    public hasObstacle:boolean = false;
    onLoad() {

    }
    start() {

    }



    update(deltaTime: number) {
        
    }
    draw(hexagon:Hexagon){
        this.hexagon = hexagon;
        var ctx = this.getComponent(Graphics);
        ctx.lineWidth = 5;
        var px=hexagon.getPx();
        var py=hexagon.getPy();
        let center = new Vec2(px,py);
        // var hexagonWidth=HexagonManager.hexagonWidth-7;
        // var hexagonheight=hexagonWidth * 0.866;
        //一边
        let p0 = this.hex_corner(center,HexagonManager.outerRadius,0);
        ctx.moveTo(p0.x, p0.y);

        let p1 = this.hex_corner(center,HexagonManager.outerRadius,1);

        ctx.lineTo(p1.x, p1.y);

        let p2 = this.hex_corner(center,HexagonManager.outerRadius,2);
        ctx.lineTo(p2.x, p2.y);
        let p3 = this.hex_corner(center,HexagonManager.outerRadius,3);
        ctx.lineTo(p3.x, p3.y);

        let p4 = this.hex_corner(center,HexagonManager.outerRadius,4);
        ctx.lineTo(p4.x, p4.y);

        let p5 = this.hex_corner(center,HexagonManager.outerRadius,5);
        ctx.lineTo(p5.x, p5.y);
        ctx.lineTo(p0.x,p0.y );

        // ctx.circle(px,py,hexagonheight);
        ctx.strokeColor.fromHEX("#363333")
        // ctx.circle(px,py,HexagonManager.hexagonWidth);
        ctx.stroke();
        //4边
        ctx.fillColor.fromHEX("#B4F1A1")
        ctx.fill();
        // this.node.getChildByName('Pianyi').getComponent(Label).string = "x:"+hexagon.x+",y:"+hexagon.y;
        // console.log("pianyi:" +"x:"+hexagon.x+",y:"+hexagon.y)
        // let cube = HexagonManager.pianyi_cube(hexagon.x,hexagon.y)
        // this.node.getChildByName('Zhou').getComponent(Label).string = "x:"+cube.x+",y:"+cube.y+",z:"+cube.z;
        // console.log("Zhou:" +"x:"+cube.x+",y:"+cube.y+",z:"+cube.z)

    }

    hex_corner(center, size, i, ) {
        var angle_deg = 60 * i + (HexagonManager.layout ===0?30:0);
        var angle_rad = Math.PI / 180 * angle_deg
        return new Vec2 (center.x + size * Math.cos(angle_rad),
            center.y + size * Math.sin(angle_rad))
    }

    /**
     * 创建障碍
     */
    creatorObstacle(){
        if (!this.hasObstacle){
            var ctx = this.getComponent(Graphics);
            this.hasObstacle = true;
            ctx.lineWidth = 5;
            var px=this.hexagon.getPx();
            var py=this.hexagon.getPy();
            let center = new Vec2(px,py);
            //    ctx.strokeColor.fromHEX("#ff0000")
            ctx.fillColor.fromHEX("#363333")
            // ctx.circle(px,py,hexagonheight);
            ctx.strokeColor.fromHEX("#363333")
            ctx.circle(px,py,HexagonManager.hexagonHeight);
            ctx.stroke();
            ctx.fill();
            // this.node.getChildByName('Pianyi').getComponent(Label).string = "x:"+hexagon.x+",y:"+hexagon.y;
            // console.log("pianyi:" +"x:"+hexagon.x+",y:"+hexagon.y)
            // let cube = HexagonManager.pianyi_cube(hexagon.x,hexagon.y)
            // this.node.getChildByName('Zhou').getComponent(Label).string = "x:"+cube.x+",y:"+cube.y+",z:"+cube.z;
            // console.log("Zhou:" +"x:"+cube.x+",y:"+cube.y+",z:"+cube.z)
        }
    }

}

