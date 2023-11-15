import BasePausableTimer from './BasePausableTimer';

export default class PausableInterval extends BasePausableTimer {

    createTimer() {
        this.timer = setInterval(this.callback, this.delayInMillis);
    }

    clearTimer() {
        clearInterval(this.timer);
        clearTimeout(this.pauseTimer);
    }

    delayAndContinue(delayInMillis: number) {
        this.pauseTimer = setTimeout(() => {
            if (this.callback) {
                this.callback();
            }
            this.start();
        }, delayInMillis);
    }

}
