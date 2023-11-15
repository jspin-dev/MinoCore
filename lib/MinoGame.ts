import { Input } from "./definitions/inputDefinitions";

import { Settings } from "./definitions/settingsDefinitions";

import { 
    Instruction,
    TimerName, 
    isTimerInfo, 
    isGlobalTimerInfo, 
    isTimerDelayInfo, 
    isAddRandomNumberInfo, 
    GameStatus
} from "./definitions/metaDefinitions";

import BasePausableTimer from "./util/async/BasePausableTimer";
import PausableInterval from "./util/async/PausableInterval";
import PausableTimeout from "./util/async/PausableTimeout";
import { execute } from "./exec";

import LifecycleProviders from "./operations/lifecycle";
import { fulfillTimerInstruction, updateStatus } from "./operations/meta";
import { Drop } from "./operations/drop";
import { handleDropLockTimer } from "./operations/lockdown";
import { StartAutoShift, Shift } from "./operations/shift";
import { Prepare as PreparePreview, RandomNumbers } from "./operations/preview";
import { hardDrop } from "./operations/drop";
import { Handling as HandlingSettings } from "./operations/settings";
import { DropScoreType } from "./definitions/scoring/scoringDefinitions";
import { updateStatsOnClock } from "./operations/statistics";
import { State } from "./definitions/stateTypes";
import { Operation } from "./definitions/operationalDefinitions";

export default class MinoGame {

    timers: Map<TimerName, BasePausableTimer>
    state: State;
    isPaused: boolean;
    onStateChanged: (state: State) => void;

    actions: { [key: string]: () => void } = {
        tick: () => this.run(updateStatsOnClock),
        prepareQueue: () => this.run(PreparePreview.provider),
        lock: () => this.run(handleDropLockTimer),
        start: () => this.run(LifecycleProviders.start),
        hardDrop: () => this.run(hardDrop),
        startAutoShift: () => this.run(StartAutoShift.provider),
        drop: () => this.run(Drop.provider(1, DropScoreType.Auto)),
        shift: () => this.run(Shift.provider(1))
    }

    init(settings: Settings): State {
        this.timers = new Map<TimerName, PausableTimeout>()
            .set(TimerName.DropLock, new PausableTimeout(settings.lockdownConfig.delay, this.actions.lock))
            .set(TimerName.DAS, new PausableTimeout(settings.das, this.actions.startAutoShift))
            .set(TimerName.Clock, new PausableInterval(1000, this.actions.tick))
            .set(TimerName.AutoDrop, new PausableInterval(settings.dropInterval, this.actions.drop))
            .set(TimerName.AutoShift,  new PausableInterval(settings.arr, this.actions.shift));

        this.run(LifecycleProviders.Makers.init(settings));
        return this.state;
    }

    setDAS(delay: number) {
        this.run(HandlingSettings.setDAS(delay));
        this.timers.get(TimerName.DAS).delayInMillis = delay;
    }

    setARR(delay: number) {
        this.run(HandlingSettings.setARR(delay));
        this.timers.get(TimerName.AutoShift).delayInMillis = delay;
    }

    setSDF(delay: number) {
        this.run(HandlingSettings.setSDF(delay));
    }

    run(operation: Operation.Any) {
        this.state = execute(this.state, operation);
        if (this.state.meta.pendingInstructions.length > 0) {
            this.state.meta.pendingInstructions.forEach(instruction =>{
                this.executeInstruction(instruction)
            });
        }
        if (this.onStateChanged) {
            this.onStateChanged(this.state);
        }
    }

    executeInstruction(instruction: Instruction) {
        let info = instruction.info;
        if (isTimerDelayInfo(info)) {
            this.timers.get(info.timerName).setDelay(info.delay);
            this.run(fulfillTimerInstruction(instruction.id));
        } else if (isTimerInfo(info)) {
            this.timers.get(info.timerName)[info.operation]();
            this.run(fulfillTimerInstruction(instruction.id));
        } else if (isGlobalTimerInfo(info)) {
            let operation = info.operation;
            this.timers.forEach(timer => timer[operation]());
            this.run(fulfillTimerInstruction(instruction.id));
        } else if (isAddRandomNumberInfo(info)) {
            let randomNumbers = Array.from(Array(info.quantity)).map(() => Math.random());
            this.run(RandomNumbers.fulfill(instruction.id, randomNumbers));
        }
    }

    gameIsActive(): boolean {
        return !this.isPaused && this.state.meta.status == GameStatus.Active
    }

    startInput(anyInput: Input.Any) {
        if (anyInput == null) { return }
        switch (anyInput.classifier) {
            case Input.Classifier.ActiveGameInput:
                this.run(LifecycleProviders.Makers.startInput(anyInput.input));
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

    endInput(anyInput: Input.Any) {
        if (anyInput == null) { return }
        if (anyInput.classifier === Input.Classifier.ActiveGameInput && this.gameIsActive()) {
            this.run(LifecycleProviders.EndInput.provider(anyInput.input));
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
        this.run(LifecycleProviders.Makers.init(this.state.settings))
        this.run(PreparePreview.provider);
        this.run(LifecycleProviders.start);
    }

}

export enum HandlingParam {
    DAS,
    ARR,
    SDF
}
