import type { Provider, Operation } from "../definitions/operationalDefinitions";
import type { State } from "../definitions/stateDefinitions";
import {  GameStatus } from "../definitions/metaDefinitions";
import { TimerOperation, TimerName } from "../definitions/metaDefinitions";
import MetaDrafters from "../drafters/metaDrafters";

export let draftInstructionsOnStart: Operation[] = [
    MetaDrafters.Makers.updateStatus(GameStatus.Active),
    MetaDrafters.Makers.insertTimerOperation(TimerName.Clock, TimerOperation.Start),
    MetaDrafters.Makers.insertTimerOperation(TimerName.AutoDrop, TimerOperation.Start)
]

export let cancelAutoShift: Provider = {
    requiresActiveGame: true,
    provide: () => [
        MetaDrafters.Makers.insertTimerOperation(TimerName.DAS, TimerOperation.Cancel),
        MetaDrafters.Makers.insertTimerOperation(TimerName.AutoShift, TimerOperation.Cancel)
    ]
}

