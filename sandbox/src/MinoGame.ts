import Input from "../../build/definitions/Input"
import type BasePausableTimer from "../../build/util/async/BasePausableTimer"
import PausableInterval from "../../build/util/async/PausableInterval"
import PausableTimeout from "../../build/util/async/PausableTimeout"
import type Operation from "../../build/definitions/Operation"
import Statistics from "../../build/addons/definitions/GuidelineStatistics"
import type CoreDependencies from "../../build/core/definitions/CoreDependencies"
import CoreState from "../../build/core/definitions/CoreState"
import type OperationResult from "../../build/core/definitions/CoreOperationResult"
import type PreviewGridState from "../../build/addons/definitions/GridState"
import TimerName from "../../build/core/definitions/TimerName"
import CoreOperation from "../../build/core/definitions/CoreOperation"
import type GameSchema from "../../build/schema/definitions/GameSchema"
// import syncPreviewGrids from "./addons/gridBuilder/gridBuilderAddon"
import SideEffectRequest from "../../build/core/definitions/SideEffectRequest"
import DropType from "../../build/definitions/DropType"
import recordTick from "../../build/core/operations/root/lifecycle/recordTick"
import initialize from "../../build/core/operations/root/lifecycle/initialize"
import start from "../../build/core/operations/root/lifecycle/start"
import prepareQueue from "../../build/core/operations/root/lifecycle/prepareQueue"
import togglePause from "../../build/core/operations/root/lifecycle/togglePause"
import triggerLockdown from "../../build/core/operations/root/triggerLockdown"
import startAutoShift from "../../build/core/operations/member/movement/startAutoShift"
import refresh from "../../build/core/operations/root/lifecycle/refresh"
import updateStatistics from "../../build/addons/addons/guidelineStatistics/guidelineStatsAddon"
import addRns from "../../build/core/operations/root/addRns"
import startInput from "../../build/core/operations/root/lifecycle/startInput"
import endInput from "../../build/core/operations/root/lifecycle/endInput"
import drop from "../../build/core/operations/member/movement/drop"
import shift from "../../build/core/operations/member/movement/shift"
import type Settings from "../../build/settings/definitions/Settings"

type StatisticsOperation = Operation<Statistics, void>

class MinoGame {

    timers: Record<TimerName, BasePausableTimer>
    state: MinoGame.State
    onStateChanged: (state: MinoGame.State) => void
    dependencies: CoreDependencies

    constructor(dependencies: CoreDependencies, settings: Settings) {
        this.dependencies = dependencies
        this.state = {
            core: CoreState.initial(settings),
            statistics: Statistics.initial,
            previewGrids: null
        }
    }

    init(): MinoGame.State {
        let { dasMechanics, dropMechanics } = this.state.core.settings
        this.timers = {
            [TimerName.Clock]: new PausableInterval(1000, () => this.run(recordTick)),
            [TimerName.DropLock]: new PausableTimeout(500, () => this.run(triggerLockdown)),
            [TimerName.DAS]: new PausableTimeout(dasMechanics.delay, () => this.run(startAutoShift)),
            [TimerName.Drop]: new PausableInterval(dropMechanics.autoInterval, () => this.run(drop(DropType.Soft, 1))), // TODO: Soft vs Auto type
            [TimerName.AutoShift]: new PausableInterval(dasMechanics.autoShiftInterval, () => this.run(shift(1)))
        }
        return this.run(initialize)
    }

    run(rootOperation: Operation<OperationResult<CoreState>, CoreDependencies>): MinoGame.State {
        const coreResult = CoreOperation.execute(rootOperation, this.state.core, this.dependencies)
        const statsOperation = updateStatistics(coreResult.events) as StatisticsOperation
        const statistics = statsOperation.execute(this.state.statistics)
        // let previewGridsOperation = syncPreviewGrids(coreResult) as PreviewGridOperation
        // let previewGrids = previewGridsOperation.execute(this.state?.previewGrids ?? PreviewGridState.initial)

        // let diff = CoreState.diff(this.state?.core, coreResult.state)
        // if (diff) {
        //     console.log(JSON.stringify(diff))
        // }

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