import Input from "./definitions/Input";
import BasePausableTimer from "./util/async/BasePausableTimer";
import PausableInterval from "./util/async/PausableInterval";
import PausableTimeout from "./util/async/PausableTimeout";
import Operation from "./definitions/Operation";
import Settings from "./definitions/Settings";
import Statistics from "./addons/guidelineStatistics/definitions/GuidelineStatistics";
import CoreDependencies from "./definitions/CoreDependencies";
import CoreState from "./definitions/CoreState";
import GenericCoreOperations from "./definitions/CoreOperations";
import OperationResult from "./definitions/CoreOperationResult";
import PreviewGridState from "./addons/gridBuilder/definitions.ts/GridState";
import updateStatistics from "./addons/guidelineStatistics/guidelineStatsAddon";
// import syncPreviewGrids from "./addons/gridBuilder/gridBuilderAddon";
import SideEffect from "./definitions/SideEffect";
import schema from "./schemas/srsSchema";

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
        let dependencies = { defaultSettings: this.defaultSettings, operations: this.operations, schema };
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