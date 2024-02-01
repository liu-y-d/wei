import {HexagonManager} from "db://assets/Script/HexagonManager";
import {Global} from "db://assets/Script/Global";
import {Draw} from "db://assets/Script/Draw";
import {Blocks} from "db://assets/Script/NearestSolver";
import {LevelDesign} from "db://assets/Script/LevelDesign";

export default function randomSolver(x: number, y: number): number {

    let blocks = new Blocks();
    blocks.calcAllDistances();
    let block = blocks.getBlock(x, y);
    let directions = block.directions;
    if (directions.length <= 0) {
        return -1;
    } else {
        let nearHexagonCoords = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords();
        let nearHexagonCoordsFilter = nearHexagonCoords.filter(c=>{
            return (c.x>=0 && c.x<LevelDesign.getInstance().getShapeManager().WidthCount && c.y>=0 && c.y<LevelDesign.getInstance().getShapeManager().HeightCount) && !Global.getInstance().tileMap[c.x][c.y].getComponent(Draw).hasObstacle;
        })
        if (!(nearHexagonCoordsFilter&&nearHexagonCoordsFilter.length>0)) {
            return -1;
        }
        return nearHexagonCoords.indexOf(nearHexagonCoordsFilter[Math.floor(Math.random() * nearHexagonCoordsFilter.length)]);
    }

}