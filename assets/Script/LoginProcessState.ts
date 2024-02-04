import { IProcessStateNode } from "./IProcessStateNode";

import { sys,director } from 'cc';
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Global} from "db://assets/Script/Global";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
export class LoginProcessState implements IProcessStateNode {
    readonly key = ProcessStateEnum.login;

    onExit() {
    }

    onHandlerMessage() {
    }
    private flag: boolean = false;
    onInit() {
        try {
            const wx = window['wx'];//避开ts语法检测
            const info = wx.getSystemInfoSync();//立即获取系统信息
            const w = info.screenWidth;//屏幕宽
            const h = info.screenHeight;//屏幕高
            let playerInfo = {
                playerId:'',
                nickName:'',
                avatarUrl:'',
                gameLevel:1
            };
            wx.login({
                success(res) {
                    if (res.code) {
                        // window.wx.getSystemInfoSync().screenHeight
                        // window.wx.getSystemInfoSync().screenHeight
                        console.log("code:",res.code)
                        let button = wx.createUserInfoButton({
                            type: 'text',
                            text: '点击屏幕任意地方进入游戏',
                            style: {
                                left: 0,
                                top: 50,
                                width: w,
                                height: h,
                                backgroundColor: '#00000000',//最后两位为透明度
                                color: '#CCCCCC',
                                fontSize: 20,
                                textAlign: "center",
                                lineHeight: h,
                            }
                        })
                        let code = res.code;
                        button.onTap((res) => {
                            if (!this.flag) {
                                if ('errno' in res) {
                                    console.log("用户拒绝授权！")
                                    return;
                                }
                                this.flag = true;
                                // 此处可以获取到用户信息
                                console.log("userInfo",res)
                                playerInfo.nickName = res.userInfo.nickName;
                                playerInfo.avatarUrl = res.userInfo.avatarUrl;
                                playerInfo.gameLevel = 1;
                                let existPlayer = Global.getInstance().getPlayerInfo();
                                if (!existPlayer) {
                                    Global.getInstance().setPlayerInfo(playerInfo);
                                }
                                button.destroy();
                                director.loadScene("Main",()=>{ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main)});

                                // 目前采用单机


                            }

                        })

                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        } catch (e) {
            this.flag = false;
        }


    }

    onUpdate() {
    }

    _listener: { [p: string]: (target, params) => (void | null) };
    
}