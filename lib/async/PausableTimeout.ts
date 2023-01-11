import BasePausableTimer from './BasePausableTimer';

export default class PausableTimeout extends BasePausableTimer {

    createTimer() {
        this.timer = setTimeout(this.callback, this.delayInMillis);
    }

    clearTimer() {
        clearTimeout(this.timer);
    }

    delayAndContinue(delayInMillis: number) {
        this.timer = setTimeout(this.callback, delayInMillis);
    }

}
