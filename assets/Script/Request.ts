import {GameStateEnum, Global} from "db://assets/Script/Global";

import {sys} from 'cc';
const wx = window['wx'];

export function refreshToken(call:Function) {
    wx.request({
        method: 'POST',
        url: Global.getInstance().getPath('base/refreshToken'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            Global.getInstance().setToken(res.data.data.token)
            call()
            // const refreshMargin = 5*60;
            // let expires = res.data.data.expires;
            // const refreshTokenTime = expires - refreshMargin;
            // setTimeout(() => {
            //     refreshToken();
            // },Math.max(0, (refreshTokenTime - Date.now()/1000)*1000));

        }
    })
}
export function getCurrentUserGameLevelReq(callback:Function) {
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/currentGameLevel'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{getCurrentUserGameLevelReq(callback)})
            }else {
                callback(res.data.data.gameLevel);
            }
        }
    })
}
export type Leaf = {remaining:number,infinity:string}
export function getLeaf(callback:Function) {
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/getLeaf'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{getLeaf(callback)})
            }else {
                callback(res.data.data.leaf as Leaf);
            }
        }
    })
}
export function consumeLeaf(callback:Function) {
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/consumeLeaf'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{consumeLeaf(callback)})
            }else {
                callback(res.data.data.status);
            }
        }
    })
}
export type GlobalProps={
    id:number,
    type:number,
    fixedPropsNum:number,
    randomPropsWeight:number,
    show:number
}
export function GetGlobalPropsConfig(){
    let props
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/propsConfig'),
        header: {
            'content-type': 'application/json',
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success(res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{GetGlobalPropsConfig()})
            }else {
                props = res.data.data.props as GlobalProps[];
                sys.localStorage.setItem("GlobalProps", JSON.stringify(props))
            }
        }
    });
}
export function infinityLeaf(callback:Function) {
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/infinityLeaf'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{infinityLeaf(callback)})
            }else {
                callback(res.data.data.status);
            }
        }
    })
}
export function getAllPropsGuide(callback:Function) {
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/getAllPropsGuide'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{getAllPropsGuide(callback)})
            }else {
                callback(res.data.data.guides);
            }
        }
    })
}

export function saveUserPropsGuide(propsId, show: boolean) {
    wx.request({
        method: 'POST',
        url: Global.getInstance().getPath('game/savePropsGuide'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        data: {
            propsId: propsId,
            showTip: show?0:1
        },
        success(res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{saveUserPropsGuide(propsId,show)})
            }
        }
    })
}

export function gameOverReq(gameLevel, status, callback:Function) {
    let flag;
    if (status == GameStateEnum.win) {
        flag = 1
    }else {
        flag = 2
    }
    // let param = EncryptUtil.aesEncrypt(JSON.stringify({gameLevel:gameLevel,status:flag}))
    let param =  Global.getInstance().rsa.encrypt(JSON.stringify({gameLevel:gameLevel,status:flag}))

    wx.request({
        method: 'POST',
        url: Global.getInstance().getPath('game/gameOver'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        data: {
            param: base64ReplaceSpecialChar(param)
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{gameOverReq(gameLevel,status,callback)})
            }else {
                callback(res.data.data.status);
            }
        }
    })
}

export function getWorldRank(callback:Function) {
    wx.request({
        method: 'GET',
        url: Global.getInstance().getPath('game/worldRank'),
        header: {
            'content-type': 'application/json', // 默认值
            'AuthorizationGame': "Bearer " + Global.getInstance().getToken()
        },
        success (res) {
            if (res.statusCode == 401) {
                refreshToken(()=>{getWorldRank(callback)})
            }else {
                callback(res.data.data.worldRank);
            }
        }
    })
}
function base64ReplaceSpecialChar(str:string):string{
    let regex = /\+/g;
    let regex1 = /\//g;
    let globalReplacedStr = str.replace(regex, "-");
    return globalReplacedStr.replace(regex1,"_")

}