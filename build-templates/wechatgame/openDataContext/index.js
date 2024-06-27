import {rankStyle} from './render/style'
import {setRankTemplate} from './render/template'
const Layout = requirePlugin('Layout').default;
import {friendRankData, getFriendRankData} from './render/friendRank'

let __env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;
let sharedCanvas = __env.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');

function draw() {
    Layout.clear();
    Layout.init(setRankTemplate(friendRankData), rankStyle);
    Layout.layout(sharedContext);
    const list = Layout.getElementById('list');


    // 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行
    Layout.ticker.next(() => {
        // 隐藏滚动条
        list.vertivalScrollbar.hide();

        // // 改变滚动条的宽度
        // list.vertivalScrollbar.width = 20;
        //
        // // 改变滚动条的背景颜色
        // list.vertivalScrollbar.style.backgroundColor = 'red';
    });

}

function updateViewPort(data) {
    Layout.updateViewPort({
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
    });
}

__env.onMessage(data => {
    console.log(data)
    if (data.type === 'engine' && data.event === 'viewport') {
        updateViewPort(data);
        showLoading();
    } else if (data.value === 'rankData') {
        // showLoading();
        getFriendRankData("friendRank_1", data.userId, draw)

    }
});

export function showLoading() {
    const style = {
        container: {
            width: '100%',
            height: '100%',
            justifyContent: "center",
            alignItems: "center",
        },
        loading: {
            width: 60,
            height: 60,
            borderRadius: 30,
        },
    };

    const tpl = `
<view id="container">
  <image src="openDataContext/render/loading.png" id="loading"></image>
</view>
`;
    Layout.clear();
    Layout.init(tpl, style);
    Layout.layout(sharedContext);

    const image = Layout.getElementById('loading');
    let degrees = 0;
    Layout.ticker.add(() => {
        degrees = (degrees + 2) % 360;
        image.style.transform = `rotate(${degrees}deg)`;
    });
}
