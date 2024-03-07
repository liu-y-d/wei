import {Node} from 'cc';
export interface BaseProps{
    id:number,
    name:string,
    description?:string,
    defaultNum?:number,
    spriteFrameUrl?:string,
    node?:Node
    init(),
    setNum(num?:number)
}
export enum GamePropsEnum {
    /**
     * 障碍重置
     */
    OBSTACLE_RESET,
    /**
     * 后退一步
     */
    BACK,
    /**
     * 预测
     */
    FORECAST,
    /**
     * 冻结
     */
    FREEZE
}