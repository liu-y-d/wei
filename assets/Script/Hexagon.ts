import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Vec3,Vec2} from "cc";
export class Hexagon {

    public x: number;
    public y: number;

    public getPx() {
        if (HexagonManager.layout == 0) {
            if (this.y % 2 == 0) {
                return HexagonManager.hexagonHeight * (this.x * 2 + 1);
            }
            //奇数
            else {
                return 2 * HexagonManager.hexagonHeight * (this.x + 1);
            }
        }else {
            return HexagonManager.hexagonWidth * (this.x * 1.5 + 1);
        }
    }
    public getPy() {
        if (HexagonManager.layout == 0) {
            return HexagonManager.hexagonWidth * (this.y * 1.5 + 1);
        }else {
            if (this.x % 2 == 0) {
                return HexagonManager.hexagonHeight * (this.y * 2 + 1);
            }
            //奇数
            else {
                return 2 * HexagonManager.hexagonHeight * (this.y + 1);
            }
        }
    }

}