import {Node} from 'cc';
import {resume} from "db://assets/Script/Global";
export interface BaseProps{
    id:number,
    name:string,
    description?:string,
    defaultNum?:number,
    spriteFrameUrl?:string,
    target?:Node
    init(),
    setNum(num?:number)
    inure()
    resume:Function
    isTweening:boolean
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