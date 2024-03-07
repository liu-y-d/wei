import { _decorator, Component, Node,Prefab,instantiate,UITransform,Label,Color } from 'cc';
import {Bullet} from "db://assets/Script/Bullet";
import {LevelDesign} from "db://assets/Script/LevelDesign";
const { ccclass, property } = _decorator;

@ccclass('BulletScreen')
export class BulletScreen extends Component {

    @property({type: Prefab})
    bulletPrefab:Prefab;

    bulletsArray = [];
    bulletContent = [];
    bulletColor = [
        "#F9DC24",
        "#E85827",
        "#B05923",
        "#81D8D0",
        "#FFFFFF",
        "#FFC107",
        "#00BCD4",
        "#FFA07A",
        "#7FFF00",
        "#FF8C00"
    ]
    start() {
        this.bulletContent = LevelDesign.getInstance().bulletArray;
    }

    update(deltaTime: number) {
        let record = [];
        for (let i=0; i<this.bulletsArray.length; i++) {
            this.bulletsArray[i].setPosition(this.bulletsArray[i].getPosition().x - deltaTime*this.bulletsArray[i].getComponent(Bullet).speed, this.bulletsArray[i].getPosition().y)
            // 文本完全移动到屏幕左侧后，回收
            if (this.bulletsArray[i].getPosition().x <= -(360 + this.bulletsArray[i].getComponent(UITransform).contentSize.width)) {
                this.bulletsArray[i].removeFromParent();
                record.push(i);
            }
        }

        // 删除已完成移动的文本元素
        for (let i=0; i<record.length; i++) {
            this.bulletsArray.splice(record[i], 1);
        }

        // 当前所有提示文本消失后，重新生成
        if (this.bulletsArray.length == 0) {
            let trigger = Math.random();
            if (trigger>0.99)
            {this.spawnBullets();}
        }
    }
    spawnBullets () {
        // 生成提示文本
        let num = Math.round(Math.random()*4);      // 决定生成的数量
        // let num = 1;

        for (let i=0; i<num; i++) {
            let bullet = instantiate(this.bulletPrefab);
            this.bulletsArray.push(bullet);
            this.node.addChild(bullet);
            bullet.getComponent(Label).string = this.randomContent();
            bullet.getComponent(Label).color = this.randomColor();
            bullet.getComponent(Bullet).speed = this.randomSpeed();
            bullet.setPosition(360,this.randomStartPosY());
        }
    }
    randomColor () {
        // 文本颜色随机
        let index = Math.round(Math.random()*(this.bulletColor.length-1));
        let color = this.bulletColor[index];
        return new Color(color);
    }

    randomContent () {
        // 文本内容随机
        let index = Math.round(Math.random()*(this.bulletContent.length-1));
        let bullet = this.bulletContent[index];
        return bullet;
    }

    randomSpeed () {
        // 移动速度随机
        let speed = Math.round(Math.random()*100) + 50;
        return speed;
    }

    randomStartPosY () {
        // 初始y坐标随机
        let height = this.node.getComponent(UITransform).contentSize.height;
        let y = Math.round(Math.random()*height*0.8) - height*0.4;
        return y;
    }
}

