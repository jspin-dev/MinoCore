import Input from "../../build/coreOperations/definitions/Input";
import type BasePausableTimer from "../../build/util/async/BasePausableTimer";
import PausableInterval from "../../build/util/async/PausableInterval";
import PausableTimeout from "../../build/util/async/PausableTimeout";
import type Operation from "../../build/definitions/Operation";
import type Settings from "../../build/coreOperations/definitions/Settings";
import Statistics from "../../build/addons/definitions/GuidelineStatistics";
import type CoreDependencies from "../../build/coreOperations/definitions/CoreDependencies";
import CoreState from "../../build/coreOperations/definitions/CoreState";
import type GenericCoreOperations from "../../build/coreOperations/definitions/CoreOperations";
import type OperationResult from "../../build/coreOperations/definitions/CoreOperationResult";
import type PreviewGridState from "../../build/addons/definitions/GridState";
import updateStatistics from "../../build/addons/addons/guidelineStatistics/guidelineStatsAddon";
// import syncPreviewGrids from "./addons/gridBuilder/gridBuilderAddon";
import guidelineSchema from "../../build/schemas/schemas/guidelineSchema";
import SideEffect from "../../build/coreOperations/definitions/SideEffect";

type AllCoreOperations = GenericCoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>
type CoreOperation = Operation<OperationResult<CoreState>, CoreDependencies>
type StatisticsOperation = Operation<Statistics, void>

class MinoGame {

    timers: Map<SideEffect.TimerName, BasePausableTimer>
    state: MinoGame.State;
    defaultSettings: Settings;
    operations: AllCoreOperations;
    onStateChanged: (state: MinoGame.State) => void;

    constructor({ defaultSettings, operations }: CoreDependencies) {
        this.defaultSettings = defaultSettings;
        this.operations = operations;
    }

    init(): MinoGame.State {
        let runTick = () => this.run(ops => ops.recordTick);
        let runLock = () => this.run(ops => ops.triggerLockdown);
        let runAutoShift = () => this.run(ops => ops.startAutoShift);
        let runDrop = () => this.run(ops => ops.drop(1));
        let runShift = () => this.run(ops => ops.shift(1));
        this.timers = new Map<SideEffect.TimerName, PausableTimeout>([
            [SideEffect.TimerName.Clock, new PausableInterval(1000, runTick)],
            [SideEffect.TimerName.DropLock, new PausableTimeout(this.defaultSettings.lockdownConfig.delay, runLock)],
            [SideEffect.TimerName.DAS, new PausableTimeout(this.defaultSettings.das, runAutoShift)],
            [SideEffect.TimerName.AutoDrop, new PausableInterval(this.defaultSettings.dropInterval, runDrop)],
            [SideEffect.TimerName.AutoShift, new PausableInterval(this.defaultSettings.arr, runShift)]
        ]);
        this.run(ops => ops.initialize);
        return this.state;
    }

    run(getOperation: (operations: AllCoreOperations) => CoreOperation) {
        let dependencies = { defaultSettings: this.defaultSettings, operations: this.operations, schema: guidelineSchema };
        let rootOperation = getOperation(this.operations);
        let coreState = this.state?.core ?? CoreState.initial;
        let initialResult: OperationResult<CoreState> = { state: coreState, sideEffectRequests: [], events: [] };
        let coreResult = rootOperation.execute(initialResult, dependencies);
        let statsOperation = updateStatistics(coreResult) as StatisticsOperation;
        let statistics = statsOperation.execute(this.state?.statistics ?? Statistics.initial);
        // let previewGridsOperation = syncPreviewGrids(coreResult) as PreviewGridOperation;
        // let previewGrids = previewGridsOperation.execute(this.state?.previewGrids ?? PreviewGridState.initial);
        this.state = { core: coreResult.state, statistics, previewGrids: null };
        coreResult.sideEffectRequests.forEach(request => this.executeSideEffect(request));
        if (this.onStateChanged) {
            this.onStateChanged(this.state);
        }
    }

    executeSideEffect(request: SideEffect.Request) {
        switch (request.classifier) {
            case SideEffect.Request.Classifier.TimerInterval:
                this.timers.get(request.timerName).delayInMillis = request.delay;
                break;
            case SideEffect.Request.Classifier.TimerOperation:
                this.timers.get(request.timerName)[request.operation]();
                break;
            case SideEffect.Request.Classifier.Rng:
                let rns = Array.from(Array(request.quantity)).map(() => Math.random());
                this.run(ops => ops.addRns(rns));
        }
    }

    startInput(input: Input) {
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

    endInput(input: Input) {
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

namespace MinoGame {

    export interface State {
        core: CoreState
        statistics: Statistics
        previewGrids: PreviewGridState
    }

}

export default MinoGame