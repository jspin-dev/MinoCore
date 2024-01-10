import Input from "../../build/definitions/Input"
import type BasePausableTimer from "../../build/util/async/BasePausableTimer"
import PausableInterval from "../../build/util/async/PausableInterval"
import PausableTimeout from "../../build/util/async/PausableTimeout"
import type Operation from "../../build/definitions/Operation"
import type Settings from "../../build/core/definitions/Settings"
import Statistics from "../../build/addons/definitions/GuidelineStatistics"
import type CoreDependencies from "../../build/core/definitions/CoreDependencies"
import CoreState from "../../build/core/definitions/CoreState"
import type OperationResult from "../../build/core/definitions/CoreOperationResult"
import type PreviewGridState from "../../build/addons/definitions/GridState"
import TimerName from "../../build/core/definitions/TimerName"
// import syncPreviewGrids from "./addons/gridBuilder/gridBuilderAddon"
import SideEffectRequest from "../../build/core/definitions/SideEffectRequest"
import DropType from "../../build/definitions/DropType"
import defaultCoreOperations from "../../build/core/defaultCoreOperations"
import recordTick from "../../build/core/operations/root/lifecycle/recordTick"
import initialize from "../../build/core/operations/root/lifecycle/initialize"
import start from "../../build/core/operations/root/lifecycle/start"
import prepareQueue from "../../build/core/operations/root/lifecycle/prepareQueue"
import togglePause from "../../build/core/operations/root/lifecycle/togglePause"
import triggerLockdown from "../../build/core/operations/root/triggerLockdown"
import startAutoShift from "../../build/core/operations/member/movement/startAutoShift"
import schemas from "../../build/presets/tetro/tetroSchemaPresets"
import updateStatistics from "../../build/addons/addons/guidelineStatistics/guidelineStatsAddon"
import addRns from "../../build/core/operations/root/addRns"
import startInput from "../../build/core/operations/root/lifecycle/startInput"
import endInput from "../../build/core/operations/root/lifecycle/endInput"
import drop from "../../build/core/operations/member/movement/drop"
import shift from "../../build/core/operations/member/movement/shift"

type CoreOperation = Operation<OperationResult<CoreState>, CoreDependencies>
type StatisticsOperation = Operation<Statistics, void>

class MinoGame {

    timers: { [key: string]: BasePausableTimer }
    state: MinoGame.State
    defaultSettings: Settings
    onStateChanged: (state: MinoGame.State) => void
    dependencies: CoreDependencies

    constructor(defaultSettings: Settings) {
        this.defaultSettings = defaultSettings
        this.dependencies = {
            defaultSettings: this.defaultSettings,
            operations: defaultCoreOperations,
            schema: schemas.guideline
        }
    }

    init(): MinoGame.State {
        this.timers = {
            [TimerName.Clock]: new PausableInterval(1000, () => this.run(recordTick)),
            [TimerName.DropLock]: new PausableTimeout(5000, () => this.run(triggerLockdown)),
            [TimerName.DAS]: new PausableTimeout(this.defaultSettings.das.delay, () => this.run(startAutoShift)),
            [TimerName.Drop]: new PausableInterval(this.defaultSettings.dropInterval, () => this.run(drop(DropType.Soft, 1))),
            [TimerName.AutoShift]: new PausableInterval(this.defaultSettings.das.autoShiftInterval, () => this.run(shift(1)))
        }
        return this.run(initialize)
    }

    run(rootOperation: CoreOperation): MinoGame.State {
        let coreState = this.state?.core ?? CoreState.initial
        let initialResult: OperationResult<CoreState> = { state: coreState, sideEffectRequests: [], events: [] }
        let coreResult = rootOperation.execute(initialResult, this.dependencies)
        let statsOperation = updateStatistics(coreResult.events) as StatisticsOperation
        let statistics = statsOperation.execute(this.state?.statistics ?? Statistics.initial)
        // let previewGridsOperation = syncPreviewGrids(coreResult) as PreviewGridOperation
        // let previewGrids = previewGridsOperation.execute(this.state?.previewGrids ?? PreviewGridState.initial)

        // let diff = CoreState.diff(this.state?.core, coreResult.state)
        // if (diff) {
        //     console.log(JSON.stringify(diff))
        // }
        if (coreResult.sideEffectRequests.length > 0) {
            console.log(coreResult.sideEffectRequests)
        }

        // console.log(JSON.stringify(coreResult.state))

        this.state = { core: coreResult.state, statistics, previewGrids: null }
        // if (coreResult.events.length > 0) {
        //     coreResult.events.forEach(event => {
        //         console.log(event)
        //     })
        // }
        coreResult.sideEffectRequests.forEach(request => this.executeSideEffect(request))
        if (this.onStateChanged) {
            this.onStateChanged(this.state)
        }
        return this.state
    }

    executeSideEffect(request: SideEffectRequest) {
        switch (request.classifier) {
            case SideEffectRequest.Classifier.TimerInterval:
                this.timers[request.timerName].setDelay(request.delay)
                console.log("New delay"+request.timerName+","+request.delay)
                break
            case SideEffectRequest.Classifier.TimerOperation:
                this.timers[request.timerName][request.operation]()
                break
            case SideEffectRequest.Classifier.Rng:
                let rns = Array.from(Array(request.quantity)).map(() => Math.random())
                this.run(addRns(rns))
        }
    }

    startInput(input: Input) {
        if (!input) { return }
        switch (input.classifier) {
            case Input.Classifier.ActiveGame:
                this.run(startInput(input.input))
                break
            case Input.Classifier.Lifecycle:
                switch(input.input) {
                    case Input.Lifecycle.Restart:
                        this.restart()
                        break
                    case Input.Lifecycle.Pause:
                        this.run(togglePause)
                }
        }
    }

    endInput(input: Input) {
        if (input && input.classifier === Input.Classifier.ActiveGame) {
            this.run(endInput(input.input))
        }
    }

    restart() {
        this.run(initialize)
        this.run(prepareQueue)
        this.run(start)
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