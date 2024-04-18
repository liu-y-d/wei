import {IProcessStateNode} from "./IProcessStateNode";

import {sys, director, find, Node,tween,Vec3} from 'cc';
import {ProcessStateEnum} from "db://assets/Script/ProcessStateEnum";
import {Global} from "db://assets/Script/Global";
import {ProcessStateMachineManager} from "db://assets/Script/ProcessStateMachineManager";
import {AudioMgr} from "db://assets/Script/AudioMgr";
import CommonProgressBar from "db://assets/Script/CommonProgressBar";

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
                playerId: '',
                nickName: '',
                avatarUrl: '',
                gameLevel: 1
            };
            let enter = find('Canvas/Content/Enter');

            if (sys.platform === sys.Platform.WECHAT_GAME) {
                wx.login({
                    success(res) {
                        if (res.code) {
                            let code = res.code
                            // 通过 wx.getSetting 查询用户是否已授权头像昵称信息
                            wx.getSetting({
                                success(res) {
                                    if (res.authSetting['scope.userInfo']) {
                                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                                        wx.getUserInfo({
                                            withCredentials: true,
                                            success: function (res) {
                                                playerInfo.nickName = res.userInfo.nickName;
                                                playerInfo.avatarUrl = res.userInfo.avatarUrl;
                                                playerInfo.gameLevel = 1;
                                                let existPlayer = Global.getInstance().getPlayerInfo();
                                                if (!existPlayer) {
                                                    Global.getInstance().setPlayerInfo(playerInfo);
                                                }
                                                wx.request({
                                                    method: 'POST',
                                                    url: Global.getInstance().getPath("base/gameLogin"),
                                                    data: {
                                                        code:code,
                                                        rawData: res.rawData,
                                                        signature:res.signature,
                                                        encryptedData:res.encryptedData,
                                                        iv:res.iv
                                                    },
                                                    header: {
                                                        'content-type': 'application/json' // 默认值
                                                    },
                                                    success (res) {
                                                        let existPlayer = Global.getInstance().getPlayerInfo();
                                                        existPlayer.playerId = res.data.data.playerId;
                                                        Global.getInstance().setPlayerInfo(existPlayer)
                                                        Global.getInstance().setToken(res.data.data.token)
                                                        enter.active = true;
                                                        enter.off(Node.EventType.TOUCH_END)
                                                        if (Global.getInstance().getMusicState()) {
                                                            AudioMgr.inst.play('bgm',0.5)
                                                        }
                                                        enter.on(Node.EventType.TOUCH_END, () => {
                                                            director.loadScene("Main", () => {
                                                                // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main)
                                                            });
                                                        })
                                                        let progressBarNode = find('Canvas/Content/ProgressBar');
                                                        let progressBar = progressBarNode.getComponent(CommonProgressBar);
                                                        progressBar.prevNum = progressBar.num
                                                        progressBar.num = 1
                                                        tween(enter).to(0.2,{scale:new Vec3(1,1,1)}).call(()=>{
                                                            progressBar.hide();
                                                        }).start();
                                                    }
                                                })

                                            }
                                        })
                                    } else {
                                        // 否则，先通过 wx.createUserInfoButton 接口发起授权
                                        let button = wx.createUserInfoButton({
                                            type: 'text',
                                            text: '',
                                            style: {
                                                left: 0,
                                                top: 0,
                                                width: w,
                                                height: h,
                                                backgroundColor: '#00000000',//最后两位为透明度
                                                color: '#CCCCCC',
                                                fontSize: 20,
                                                textAlign: "center",
                                                lineHeight: h,
                                            }
                                        })
                                        button.onTap((res) => {
                                            // 用户同意授权后回调，通过回调可获取用户头像昵称信息
                                            if (!this.flag) {
                                                if ('errno' in res || !('userInfo' in res)) {

                                                    console.log("用户拒绝授权！")
                                                    return;
                                                }
                                                this.flag = true;
                                                playerInfo.nickName = res.userInfo.nickName;
                                                playerInfo.avatarUrl = res.userInfo.avatarUrl;
                                                playerInfo.gameLevel = 1;
                                                let existPlayer = Global.getInstance().getPlayerInfo();
                                                if (!existPlayer) {
                                                    Global.getInstance().setPlayerInfo(playerInfo);
                                                }
                                                button.destroy();
                                                wx.request({
                                                    method: 'POST',
                                                    url: Global.getInstance().getPath('base/gameLogin'),
                                                    data: {
                                                        code:code,
                                                        rawData: res.rawData,
                                                        signature:res.signature,
                                                        encryptedData:res.encryptedData,
                                                        iv:res.iv
                                                    },
                                                    header: {
                                                        'content-type': 'application/json' // 默认值
                                                    },
                                                    success (res) {
                                                        Global.getInstance().setToken(res.data.data.token)
                                                        let existPlayer = Global.getInstance().getPlayerInfo();
                                                        existPlayer.playerId = res.data.data.playerId;
                                                        Global.getInstance().setPlayerInfo(existPlayer)
                                                        enter.active = true;

                                                        enter.off(Node.EventType.TOUCH_END)
                                                        if (Global.getInstance().getMusicState()) {
                                                            AudioMgr.inst.play('bgm',0.5)
                                                        }
                                                        enter.on(Node.EventType.TOUCH_END, () => {
                                                            director.loadScene("Main", () => {
                                                                // ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main)
                                                            });
                                                        })
                                                        let progressBarNode = find('Canvas/Content/ProgressBar');
                                                        let progressBar = progressBarNode.getComponent(CommonProgressBar);
                                                        progressBar.prevNum = progressBar.num
                                                        progressBar.num = 1
                                                        tween(enter).to(0.2,{scale:new Vec3(1,1,1)}).call(()=>{
                                                            progressBar.hide();
                                                        }).start();
                                                    }
                                                })
                                                // director.loadScene("Main",()=>{ProcessStateMachineManager.getInstance().change(ProcessStateEnum.main)});

                                                // 目前采用单机


                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            }
        } catch (e) {
            this.flag = false;
        }


    }

    onUpdate() {
    }

    _listener: { [p: string]: (target, params) => (void | null) };

}