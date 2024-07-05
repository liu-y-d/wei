import {Coord, Global} from "db://assets/Script/Global";
import {Draw} from "db://assets/Script/Draw";
import {DifficultyLevelEnum, LevelDesign} from "db://assets/Script/LevelDesign";
import {GamePropsEnum} from "db://assets/Script/BaseProps";


export class Block {
    public readonly x: number;
    public readonly y: number;
    public isWall: boolean;
    public readonly isDestination: boolean;
    // 是加速带
    public readonly isDirection: boolean;
    public readonly mapPropsDirection: Coord;
    public distance: number;
    private parent: Blocks;

    constructor(parent: Blocks, i: number, j: number, isWall: boolean) {
        this.x = i;
        this.y = j;
        this.isWall = isWall;
        this.distance = Infinity;
        this.parent = parent;
        this.isDestination = LevelDesign.getInstance().currentDestination.some(d=>d.x == i && d.y == j);
        this.isDirection = Global.getInstance().tileMap[i][j].getComponent(Draw).isMapPropsDirection
        this.mapPropsDirection = Global.getInstance().tileMap[i][j].getComponent(Draw).mapPropsDirection
    }

    private _routesCount: number;

    get routesCount(): number {
        if (this._routesCount === undefined) {
            if (this.isDestination) {
                this._routesCount = 1;
            } else {
                let routesCount = 0;
                this.neighbours.forEach(neighbour => {
                    if (neighbour !== null && !neighbour.isWall) {
                        if (neighbour.distance < this.distance) {
                            routesCount += neighbour.routesCount;
                        }
                    }
                });
                this._routesCount = routesCount;
            }
        }
        return this._routesCount;
    }

    public _neighbours: Block[];

    get neighbours(): Block[] {
        if (this._neighbours === undefined) {
            let neighbours = LevelDesign.getInstance().getShapeManager().getNearbyShapeCoords({x:this.x, y:this.y});
            this._neighbours = neighbours.map(neighbour => {
                return this.parent.getBlock(neighbour.x, neighbour.y);
            });
        }
        return this._neighbours;
    }

    get directions(): number[] {
        let result = [];
        // 找到地图中的道具
        let resultBlock = [];

        this.neighbours.forEach((neighbour, direction) => {
            if (neighbour !== null && !neighbour.isWall) {
                if (neighbour.distance < this.distance) {
                    result.push(direction);
                    resultBlock.push(neighbour);
                }
            }
        });
        // 当所剩方向都是加速带并且加速带的方向是原方向
        if (resultBlock.length > 0 && resultBlock.every(r=>r.isDirection && r.mapPropsDirection.x == this.x && r.mapPropsDirection.y == this.y)) {
            return [];
        } else {
            return result;
        }
    }

    get direction(): number {
        let maxRoutesCount = 0;
        let result = -1;
        this.directions.forEach(direction => {
            let neighbour = this.neighbours[direction];
            if (neighbour.routesCount > maxRoutesCount) {
                maxRoutesCount = neighbour.routesCount;
                result = direction;
            }
        });
        return result;
    }
}

export class Blocks {
    public readonly w: number;
    public readonly h: number;
    private blocks: Block[][]=[];

    constructor() {
        this.w = LevelDesign.getInstance().getShapeManager().WidthCount;
        if (this.w <= 0) {
            throw new Error("empty blocks");
        }
        this.h = LevelDesign.getInstance().getShapeManager().HeightCount;
        for (let x in Global.getInstance().tileMap) {
            this.blocks[x] = [];
            if (Global.getInstance().tileMap[x] != null) {
                for (let i = 0; i < Global.getInstance().tileMap[x].length; i++) {
                    this.blocks[x][i] = new Block(this, parseInt(x), i, Global.getInstance().tileMap[x][i].getComponent(Draw).hasObstacle);
                }
            }
        }
    }

    getBlock(i: number, j: number): Block {
        if (!(i >= 0 && i < this.w && j >= 0 && j < this.h)) {
            return null;
        }
        return this.blocks[i][j];
    }

    /**
     * 滴水法 BFS 求每一块到边缘距离
     *
     * 1. 初始化一个队列，添加所有边界块，距离设为 0
     * 2. 遍历队列中每一个元素，对于他周围的 6 个相邻块
     *     * 如果没有遍历过，则设置为当前距离 + 1
     *     * 如果遍历过，则设置为它的距离与当前距离 + 1 中间的较小值
     */
    calcAllDistances() {
        let queue: Block[] = [];
        this.blocks.forEach(col => {
            col.forEach(block => {
                if (block.isDestination && !block.isWall) {
                    block.distance = 0;
                    queue.push(block);
                }
            });
        });


        while (queue.length > 0) {
            let block = queue.shift();
            for (let neighbour of block.neighbours) {
                if (neighbour !== null && !neighbour.isDestination && !neighbour.isWall) {
                    if (neighbour.distance > block.distance + 1) {
                        neighbour.distance = block.distance + 1;
                        if (queue.indexOf(neighbour) < 0) {
                            queue.push(neighbour);
                        }
                    }
                }
            }
        }
        // 先不考虑加速带直接设置快，设置完后，遍历所有加速带 判断加速带的方向点是否可达 目标点，不可达将加速带当作墙重新计算
        this.blocks.forEach(col => {
            col.forEach(block => {
                if (block.isDirection) {
                    let directions = this.blocks[block.mapPropsDirection.x][block.mapPropsDirection.y].directions
                    if (directions.length <= 0) {
                        block.isWall = true;
                    }
                }
            });
        });
        queue = [];
        this.blocks.forEach(col => {
            col.forEach(block => {
                if (block.isDestination && !block.isWall) {
                    block.distance = 0;
                    queue.push(block);
                }
            });
        });
        while (queue.length > 0) {
            let block = queue.shift();
            for (let neighbour of block.neighbours) {
                if (neighbour !== null && !neighbour.isDestination && !neighbour.isWall) {
                    if (neighbour.distance > block.distance + 1) {
                        neighbour.distance = block.distance + 1;
                        if (queue.indexOf(neighbour) < 0) {
                            queue.push(neighbour);
                        }
                    }
                }
            }
        }
        // console.log(JSON.stringify(this.blocks));
    };

    toString(): string {
        let lines = [];
        for (let j = 0; j < this.h; j++) {
            let distances = [];
            for (let i = 0; i < this.w; i++) {
                let block = this.getBlock(i, j);
                if (block.isWall) {
                    distances.push("*");
                } else if (block.distance === Infinity) {
                    distances.push("-");
                } else {
                    distances.push(block.distance);
                }
            }
            let line = distances.join(" ");
            if ((j & 1) === 1) {
                line = " " + line;
            }
            lines.push(line);
        }
        return lines.join("\n");
    }

    toString2(): string {
        let lines = [];
        for (let j = this.h - 1; j >= 0 ; j--) {
            let distances = [];
            for (let i = 0; i < this.w; i++) {
                let block = this.getBlock(i, j);
                if (block.isWall) {
                    distances.push("*");
                } else if (block.routesCount === Infinity) {
                    distances.push("-");
                } else {
                    distances.push(block.routesCount);
                }
            }
            let line = distances.join(" ");
            if ((j & 1) === 1) {
                line = " " + line;
            }
            lines.push(line);
        }
        return lines.join("\n");
    }
}

export function nearestSolver( x: number, y: number): number {
    let blocks = new Blocks();
    blocks.calcAllDistances();
    let block = blocks.getBlock(x, y);
    let directions = block.directions;
    // console.log(blocks.toString2());
    if (directions.length > 0) {
        return directions[0];
    } else {
        return -1;
    }
}

export default function nearestAndMoreRoutesSolver(x: number, y: number): number {
    let blocks = new Blocks();
    blocks.calcAllDistances();
    let block = blocks.getBlock(x, y);
    // console.log(blocks.toString2());
    return block.direction;
}
