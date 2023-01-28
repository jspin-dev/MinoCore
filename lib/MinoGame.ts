import { Input } from "./definitions/inputDefinitions";

import { State } from "./definitions/stateDefinitions";
import { Operation } from "./definitions/operationalDefinitions";
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

import BasePausableTimer from "./async/BasePausableTimer";
import PausableInterval from "./async/PausableInterval";
import PausableTimeout from "./async/PausableTimeout";
import { execute } from "./exec";

import LifecycleProviders from "./providers/lifecycle";
import MetaDrafters from "./drafters/metaDrafters";
import CompositeDrafters from "./drafters/compositeDrafters";
import { Drop } from "./providers/drop";
import { handleDropLockTimer } from "./providers/lockdown";
import { StartAutoShift, Shift } from "./providers/shift";
import { Prepare as PreparePreview } from "./providers/preview";
import { hardDrop } from "./providers/drop";
import SettingsDrafters from "./drafters/settingsDrafters";

export default class MinoGame {

    timers:  Map<TimerName, BasePausableTimer>
    state: State;
    isPaused: boolean;
    onStateChanged: (state: State) => void;

    actions: { [key: string]: () => void } = {
        prepareQueue: () => this.run(...PreparePreview.operations),
        lock: () => this.run(handleDropLockTimer),
        start: () => this.run(...LifecycleProviders.start),
        hardDrop: () => this.run(hardDrop),
        startAutoShift: () => this.run(StartAutoShift.provider),
        drop: () => this.run(Drop.provider(1)),
        shift: () => this.run(Shift.provider(1))
    }

    init(settings: Settings): State {
        this.timers = new Map<TimerName, PausableTimeout>()
            .set(TimerName.DropLock, new PausableTimeout(settings.lockdownConfig.delay, this.actions.lock))
            .set(TimerName.DAS, new PausableTimeout(settings.das, this.actions.startAutoShift))
            .set(TimerName.Clock, new PausableInterval(1000, () => { /* TODO */ }))
            .set(TimerName.AutoDrop, new PausableInterval(settings.dropInterval, this.actions.drop))

            .set(TimerName.AutoShift,  new PausableInterval(settings.arr, this.actions.shift));

        this.run(...LifecycleProviders.Makers.init(settings));
        return this.state;
    }

    setDAS(delay: number) {
        this.run(SettingsDrafters.Makers.setDAS(delay));
        this.timers.get(TimerName.DAS).delayInMillis = delay;
    }

    setARR(delay: number) {
        this.run(SettingsDrafters.Makers.setARR(delay));
        this.timers.get(TimerName.AutoShift).delayInMillis = delay;
    }

    setSDF(delay: number) {
        this.run(SettingsDrafters.Makers.setSDF(delay));
    }

    run(...operation: Operation[]) {
        this.state = execute(this.state, ...operation);
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
            this.run(MetaDrafters.Makers.fulfillTimerInstruction(instruction.id));
        } else if (isTimerInfo(info)) {
            this.timers.get(info.timerName)[info.operation]();
            this.run(MetaDrafters.Makers.fulfillTimerInstruction(instruction.id));
        } else if (isGlobalTimerInfo(info)) {
            let operation = info.operation;
            this.timers.forEach(timer => timer[operation]());
            this.run(MetaDrafters.Makers.fulfillTimerInstruction(instruction.id));
        } else if (isAddRandomNumberInfo(info)) {
            let randomNumbers = Array.from(Array(info.quantity)).map(() => Math.random());
            this.run(CompositeDrafters.Makers.fulfillAddRandomNumberInstruction(instruction.id, randomNumbers));
        }
    }

    gameIsActive(): boolean {
        return !this.isPaused && this.state.meta.status == GameStatus.Active
    }

    startInput(anyInput: Input.Any) {
        if (anyInput == null) { return }
        switch (anyInput.classifier) {
            case Input.Classifier.ActiveGameInput:
                if (this.gameIsActive()) {
                    this.run(LifecycleProviders.Makers.startInput(anyInput.input));
                } 
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
                this.run(MetaDrafters.Makers.updateStatus(GameStatus.Suspended));
                break;
            case GameStatus.Suspended:
                this.timers.forEach(timer => timer.resume());
                this.run(MetaDrafters.Makers.updateStatus(GameStatus.Active));
        }
    }

    restart() {
        this.isPaused = false;
        this.run(...LifecycleProviders.Makers.init(this.state.settings))
        this.run(...PreparePreview.operations);
        this.run(...LifecycleProviders.start);
    }

}

export enum HandlingParam {
    DAS,
    ARR,
    SDF
}
