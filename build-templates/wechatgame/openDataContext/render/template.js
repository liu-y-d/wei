// export function setRankTemplate(it) {
//     var out =
//         '<view class="container" id="main">  <view class="rankList"> <scrollview class="list"> ';
//     var arr1 = it.data;
//     if (arr1) {
//         var item, index = -1,
//             l1 = arr1.length - 1;
//         while (index < l1) {
//             item = arr1[index += 1];
//             out += ' ';
//             if (index % 2 === 1) {
//                 out += ' <view class="listItem"> ';
//             }
//             out += ' ';
//             if (index % 2 === 0) {
//                 out += ' <view class="listItem"> ';
//             }
//             out += ' <view id="listItemUserData"> <text class="listItemNum" value="' + (index + 1) +
//                 '"></text> <image class="listHeadImg" src="' + (item.avatarUrl) +
//                 '"></image> <text class="listItemName" value="' + (item.nickname) +
//                 '"></text> </view> <text class="listItemScore" value=" ' + (item.KVDataList[0].value.actual_score) + '"></text> </view> ';
//         }
//     }
//     out += ' </scrollview> <text class="listTips" value="' + (it.data.length) + ' 位好友参于"></text> </view></view>';
//     console.log(out)
//     return out;
// }
export function setRankTemplate(it) {
    var out = '<view class="container" id="main"> <view class="header"> <text class="title" value="好友榜"></text> </view> <view class="rankList"> <scrollview id = "list" class="list" scrollY="true"> ';
    var arr1 = it.data;
    if (arr1) {
        var item, index = -1,
            l1 = arr1.length - 1;
        while (index < l1) {
            item = arr1[index += 1];
            // out += ' ';
            // if (index % 2 === 1) {
            //     out += ' <view class="listItem listItemOld"> ';
            // }
            out += ' ';
            // if (index % 2 === 0) {
                out += ' <view class="listItem"> ';
            // }
            out += ' <text class="listItemNum" value="' + (index + 1) + '"></text> <image class="listHeadImg';

            if (index === 0) {
                out += ' no1"'
            }else if (index === 1) {
                out += ' no2"'
            }else if (index === 2) {
                out += ' no3"'
            }else {
                out += ' nox"'
            }

                out +=' src="' + (item.avatarUrl) + '"></image> <text class="listItemName" value="' + (item.nickname) + '"></text> <text class="listItemScore" value="' + item.KVDataList[0].value + '关"></text></view> ';
        }
    }
    out += ' </scrollview> <text class="listTips" value="仅展示前50位好友排名"></text> <view class="listItem selfListItem"> <text  class="listItemNum" value="' + (it.selfIndex + 1) + '"></text> <image class="listHeadImg" src="' + (it.self.avatarUrl) + '"></image> <text class="listItemName" value="' + (it.self.nickname) + '"></text> <text class="listItemScore" value="' + it.self.KVDataList[0].value + '关"></text></view> </view></view>';
    // out += '<view id="container" class="loading_container"><image class="loading" src="render/loading.png" id="loading"></image></view>'
    console.log(out)
    return out;
}
