import { Input } from "./definitions/inputDefinitions";
import { TimerName, SideEffectRequest } from "./definitions/metaDefinitions";
import BasePausableTimer from "./util/async/BasePausableTimer";
import PausableInterval from "./util/async/PausableInterval";
import PausableTimeout from "./util/async/PausableTimeout";
import { execute } from "./exec";
import { DropScoreType } from "./definitions/scoring/scoringDefinitions";
import { State } from "./definitions/stateTypes";
import Operation from "./definitions/Operation";
import recordTick from "./operations/statistics/recordTick";
import Dependencies from "./definitions/Dependencies";
import { Settings } from "./definitions/settingsDefinitions";

export default class MinoGame {

    timers: Map<TimerName, BasePausableTimer>
    state: State;
    defaultSettings: Settings;
    operations: Dependencies.Operations<State>;
    onStateChanged: (state: State) => void;

    constructor({ defaultSettings, operations }: Dependencies<State>) {
        this.defaultSettings = defaultSettings;
        this.operations = operations;
    }

    init(): State {
        let runTick = () => this.run(() => recordTick);
        let runLock = () => this.run(ops => ops.triggerLockdown);
        let runAutoShift = () => this.run(ops => ops.startAutoShift);
        let runDrop = () => this.run(ops => ops.drop(1, DropScoreType.Auto));
        let runShift = () => this.run(ops => ops.shift(1));
        this.timers = new Map<TimerName, PausableTimeout>()
            .set(TimerName.Clock, new PausableInterval(1000, runTick))
            .set(TimerName.DropLock, new PausableTimeout(this.defaultSettings.lockdownConfig.delay, runLock))
            .set(TimerName.DAS, new PausableTimeout(this.defaultSettings.das, runAutoShift))
            .set(TimerName.AutoDrop, new PausableInterval(this.defaultSettings.dropInterval, runDrop))
            .set(TimerName.AutoShift, new PausableInterval(this.defaultSettings.arr, runShift));
        this.run(ops => ops.initialize);
        return this.state;
    }

    run(getOperation: (operations: Dependencies.Operations<State>) => Operation<State>) {
        let dependencies = { defaultSettings: this.defaultSettings, operations: this.operations }
        let operation = getOperation(this.operations);
        let result = execute(this.state, State.initial, dependencies, operation);
        if (result.events.length > 0) {
            console.log(result.events);
        }
        this.state = result.state;
        result.sideEffectRequests.forEach(request => this.executeSideEffect(request));
        if (this.onStateChanged) {
            this.onStateChanged(this.state);
        }
    }

    executeSideEffect(request: SideEffectRequest.Any) {
        switch (request.classifier) {
            case SideEffectRequest.Classifier.TimerInterval:
                this.timers.get(request.timerName).delayInMillis = request.delay;
                break;
            case SideEffectRequest.Classifier.TimerOperation:
                this.timers.get(request.timerName)[request.operation]();
                break;
            case SideEffectRequest.Classifier.Rng:
                let rns = Array.from(Array(request.quantity)).map(() => Math.random());
                this.run(ops => ops.addRns(rns));
        }
    }

    startInput(input: Input.Any) {
        if (!input) { return }
        switch (input.classifier) {
            case Input.Classifier.ActiveGameInput:
                this.run(ops => ops.startInput(input.input));
                break;
            case Input.Classifier.Lifecycle:
                switch(input.input) {
                    case Input.Lifecycle.Restart:
                        this.restart();
                        break;
                    case Input.Lifecycle.Pause:
                        this.run(ops => ops.togglePause)
                }
                break;
            default:
                console.error("Unknown input type");
        }
    }

    endInput(input: Input.Any) {
        if (input && input.classifier === Input.Classifier.ActiveGameInput) {
            this.run(ops => ops.endInput(input.input));
        }
    }

    restart() {
        this.run(ops => ops.initialize);
        this.run(ops => ops.prepareQueue);
        this.run(ops => ops.start);
    }

}
