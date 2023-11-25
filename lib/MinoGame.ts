import { Input } from "./definitions/inputDefinitions";

import { Randomization, Settings } from "./definitions/settingsDefinitions";

import { 
    TimerName, 
    GameStatus,
    SideEffectRequest
} from "./definitions/metaDefinitions";

import BasePausableTimer from "./util/async/BasePausableTimer";
import PausableInterval from "./util/async/PausableInterval";
import PausableTimeout from "./util/async/PausableTimeout";
import { execute } from "./exec";
import { DropScoreType } from "./definitions/scoring/scoringDefinitions";
import { Dependencies, State } from "./definitions/stateTypes";
import Operation from "./definitions/Operation";
import { PresetRandomizers } from "./dependencies/randomizers";
import startAutoShift from "./operations/shift/startAutoShift";
import drop from "./operations/drop/drop";
import shift from "./operations/shift/shift";
import initialize from "./operations/lifecycle/initialize";
import start from "./operations/lifecycle/start";
import startActiveInput from "./operations/lifecycle/startInput";
import endActiveInput from "./operations/lifecycle/endInput";
import prepareQueue from "./operations/next/prepareQueue";
import addRns from "./operations/next/addRns";
import recordTick from "./operations/statistics/recordTick";
import hardDrop from "./operations/drop/hardDrop";
import updateStatus from "./operations/lifecycle/updateStatus";
import triggerLockdown from "./operations/lockdown/triggerLockdown";

export default class MinoGame {

    timers: Map<TimerName, BasePausableTimer>
    state: State;
    isPaused: boolean;
    dependencies: Dependencies;
    onStateChanged: (state: State) => void;

    actions: { [key: string]: () => void } = {
        tick: () => this.run(recordTick),
        prepareQueue: () => this.run(prepareQueue),
        lock: () => this.run(triggerLockdown),
        start: () => this.run(start),
        hardDrop: () => this.run(hardDrop),
        startAutoShift: () => this.run(startAutoShift),
        drop: () => this.run(drop(1, DropScoreType.Auto)),
        shift: () => this.run(shift(1))
    }

    init(settings: Settings): State {
        this.timers = new Map<TimerName, PausableTimeout>()
            .set(TimerName.DropLock, new PausableTimeout(settings.lockdownConfig.delay, this.actions.lock))
            .set(TimerName.DAS, new PausableTimeout(settings.das, this.actions.startAutoShift))
            .set(TimerName.Clock, new PausableInterval(1000, this.actions.tick))
            .set(TimerName.AutoDrop, new PausableInterval(settings.dropInterval, this.actions.drop))
            .set(TimerName.AutoShift,  new PausableInterval(settings.arr, this.actions.shift));
        this.dependencies = this.generateDependencies(settings);
        this.run(initialize(settings));
        return this.state;
    }
    
    generateDependencies(settings: Settings): Dependencies {
        let queueRandomizer: Dependencies.QueueRandomizer
        switch(settings.randomization) {
            case Randomization.Classic:
                queueRandomizer = PresetRandomizers.Classic.dependencies;
            case Randomization.Bag:
                queueRandomizer = PresetRandomizers.NBag.dependencies;
        }
        return { queueRandomizer }
    }

    run(operation: Operation.Any) {
        let result = execute(this.state, this.dependencies, operation);
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
                this.run(addRns(rns));
        }
    }

    gameIsActive(): boolean {
        return !this.isPaused && this.state.meta.status == GameStatus.Active
    }

    startInput(anyInput: Input.Any) {
        if (anyInput == null) { return }
        switch (anyInput.classifier) {
            case Input.Classifier.ActiveGameInput:
                this.run(startActiveInput(anyInput.input));
                break;
            case Input.Classifier.Lifecycle:
                switch(anyInput.input) {
                    case Input.Lifecycle.Restart:
                        this.restart();
                        break;
                    case Input.Lifecycle.Pause:
                        this.togglePause();
                }
                break;
            default:
                console.error("Unknown input type");
        }
    }

    endInput(input: Input.Any) {
        if (input == null) { return }
        if (input.classifier === Input.Classifier.ActiveGameInput && this.gameIsActive()) {
            this.run(endActiveInput(input.input));
        }
    }

    togglePause() {
        switch (this.state.meta.status) {
            case GameStatus.Active:
                this.timers.forEach(timer => timer.pause());
                this.run(updateStatus(GameStatus.Suspended));
                break;
            case GameStatus.Suspended:
                this.timers.forEach(timer => timer.resume());
                this.run(updateStatus(GameStatus.Active));
        }
    }

    restart() {
        this.isPaused = false;
        this.run(initialize(this.state.settings))
        this.run(prepareQueue);
        this.run(start);
    }

}
