import {_decorator, Component, Node, Label} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('InfinityLeafScheduleAdapter')
export class InfinityLeafScheduleAdapter extends Component {
    countdownSeconds:number; // 倒计时20分钟

    updateLabel
    start() {


    }

    countDown(seconds,callback) {
        this.countdownSeconds = seconds; // 倒计时20分钟
        function formatSecondsAsMinutesAndSeconds(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            const remainingSeconds = totalSeconds % 60;

            // 补足秒数为两位数
            const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

            // 注意这里的分钟也需要补足两位数
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

            return formattedMinutes + ':' + formattedSeconds;
        }
        let nowSeconds = Math.floor(Date.now() / 1000);
        console.log(nowSeconds)

        let stopTime = this.countdownSeconds + 1200
        let remaining = stopTime - nowSeconds;
        if ( remaining < 0) {
            callback()
        }else {
            this.node.getComponent(Label).string = formatSecondsAsMinutesAndSeconds(remaining);
            this.updateLabel = function () {
                if (remaining <= 0) {
                    // 在第六次执行回调时取消这个计时器
                    callback()
                    this.unschedule(this.updateLabel);
                    return
                }
                remaining--
                this.node.getComponent(Label).string = formatSecondsAsMinutesAndSeconds(remaining);
            }
            this.schedule(this.updateLabel, 1)
        }
    }



    update(deltaTime: number) {

    }
}

