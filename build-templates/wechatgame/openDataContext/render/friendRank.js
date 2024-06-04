import {showLoading} from "../index";

export let friendRankData = {
    data: [
        /*
        {
            rankScore: 0,
            avatarUrl: '',
            nickname: '',
        },
        */
    ],
    self: null,
    selfIndex: null,
};
/**
 * 获取好友排行榜列表
 */
export function getFriendRankData(key,userId, callback) {
    wx.getFriendCloudStorage({
        keyList: [key],
        success: res => {
            friendRankData.data = res.data;

            // for (let i = 0; i < 50; i++) {
            //     friendRankData.data.push(res.data[0])
            // }
            friendRankData.data = friendRankData.data.filter(a=>a.KVDataList && a.KVDataList.length >0).sort((a, b) => {
                return b.KVDataList[0].value - a.KVDataList[0].value
            });
            friendRankData.data.forEach((value, index)=>{
                if (friendRankData.self == null && value.openid === userId) {
                    friendRankData.selfIndex = index;
                    friendRankData.self = value;
                }
            })
            console.log("getFriendData success--------", friendRankData);

            callback && callback();
        },
        fail: res => {
            console.log("getFriendData fail--------", res);
            callback && callback();
        },
    });
}
