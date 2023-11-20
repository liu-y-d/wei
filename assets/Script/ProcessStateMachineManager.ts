import {ProcessStateMachine} from "./ProcessStateMachine";
import {GameProcessState} from "db://assets/Script/GameProcessState";
import {GhostState} from "db://assets/Script/GhostState";
import {ObstacleState} from "db://assets/Script/ObstacleState";


/**
 * 流程状态机管理类
 */
export class ProcessStateMachineManager {
    private static _instance: ProcessStateMachineManager;
    public static getInstance(): ProcessStateMachineManager {
        if (!this._instance) {
            this._instance = new ProcessStateMachineManager();
        }
        return this._instance;
    }
    
    private _state_machine : ProcessStateMachine = new ProcessStateMachine();

    public init():void {

        let gameProcessState = new GameProcessState();
        this._state_machine.addNode(gameProcessState.key,gameProcessState);
        let ghostState = new GhostState();
        this._state_machine.addNode(ghostState.key,ghostState);
        let obstacleState = new ObstacleState();
        this._state_machine.addNode(obstacleState.key,obstacleState);
    }

    /**
     * 转换流程
     * @param key
     */
    public change(key: string) {
        this._state_machine.swith(key);
    }

    public get(key: string) {
        return this._state_machine.getNode(key);
    }

    public update(deltaTime,target) {
        this._state_machine.update(deltaTime,target);
    }
    public updateByKey(key,deltaTime,target) {
        this._state_machine.getNode(key).onUpdate(deltaTime,target);
    }

    public putMessage(key:string,code:string,...params) {
        this._state_machine.getNode(key).onHandlerMessage(code,params);
    }
}