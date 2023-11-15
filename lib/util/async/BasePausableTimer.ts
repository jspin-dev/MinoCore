export default class BasePausableTimer {

    delayInMillis: number;
    callback: (args: void) => void;
    debug: boolean;
    label: string;
    timeLastResumed: number;
    accumulatedDelay: number;
    timePaused: number;
    timer: NodeJS.Timer;
    pauseTimer: NodeJS.Timer;

    constructor(delayInMillis: number, callback: (args: void) => void) {
        if (this.constructor == BasePausableTimer) {
            throw new Error(`Abstract class ${this.constructor.name} can't be instantiated.`);
        }
        this.delayInMillis = delayInMillis;
        this.callback = callback;
    }

    createTimer() {
        throw new Error("Method 'createTimer()' must be implemented.");
    }

    clearTimer() {
        throw new Error("Method 'clearTimer()' must be implemented.");
    }

    delayAndContinue(_delayInMillis: Number) {
        throw new Error("Method 'delayAndContinue()' must be implemented.");
    }

    start() {
        if (this.debug) {
            console.log(`Starting timer ${this.label} with a ${this.delayInMillis}ms delay`);
        }
        this.clearTimer();
        this.createTimer();
        this.timeLastResumed = Date.now();
        this.accumulatedDelay = 0;
        this.timePaused = null;
    }

    reset(enabled: Boolean) {
        if (enabled) {
            this.start();
        } else {
            this.cancel();
        }
    }

    isActive() {
        return this.timer && !this.timePaused;
    }

    setDebugMode(label: string, debug: boolean) {
        this.label = label;
        this.debug = debug;
    }

    cancel() {
        if (this.debug) {
            console.log(`Canceling timer ${this.label}`);
        }
        this.clearTimer();
        this.timer = null;
        this.timePaused = null;
    }

    pause() {
        if (this.debug) {
            console.log(`Pausing timer ${this.label} with ${this.delayInMillis - this.accumulatedDelay}ms remaining`);
        }
        this.clearTimer();
        this.timePaused = Date.now();
    }

    resume() {
        if (this.timer && this.timePaused) {
            if (this.debug) {
                console.log(`Resuming timer ${this.label}`);
            }
            this.accumulatedDelay += this.timePaused - this.timeLastResumed;
            this.delayAndContinue(this.delayInMillis - this.accumulatedDelay);
            this.timeLastResumed = Date.now();
            this.timePaused = null;
        }
    }
    
    setDelay(delayInMillis: number) {
        this.delayInMillis = delayInMillis;
        this.start();
    }

}
