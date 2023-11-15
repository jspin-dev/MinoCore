import { TimerName } from "../definitions/metaDefinitions";

import { MovePiece } from "./movement";
import { instantShift } from "./shift";
import { Lock, UpdateLockStatus } from "./lockdown";
import { insertTimerDelayInstruction } from "./meta";
import { updateStatsOnDrop } from "./statistics";

import { instantAutoShiftActive, findHardDropDistance } from "../util/stateUtils";
import { DropScoreType } from "../definitions/scoring/scoringDefinitions";
import { countStep } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { State } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";

/**
 * Note that ghost coordinates NEVER depend on y coordinate position. If the ghost and active piece 
 * both share coordinates, the active piece will be the one displayed on the playfield grid. This will give the 
 * effect of the ghost being partially "behind" the active piece
 */
export namespace Drop {

    let continueInstantShiftIfActive = Operation.Provide(({ meta, settings }) => {
        return Operation.applyIf(instantAutoShiftActive(meta, settings), instantShift);
    })

    export let provider = (dy: number, dropScoreType: DropScoreType) => Operation.SequenceStrict(
        MovePiece.provider(0, dy),
        UpdateLockStatus.provider(MovementType.Drop),
        updateStatsOnDrop(dropScoreType, dy),
        continueInstantShiftIfActive
    )

}

export let instantDrop = (dropScoreType: DropScoreType) => Operation.ProvideStrict(({ playfield, settings }) => {
    let n = findHardDropDistance(playfield, settings);
    return Drop.provider(n, dropScoreType);
})

export let hardDrop = Operation.Sequence(instantDrop(DropScoreType.Hard), Lock.provider)

let setSoftDropActive = (active: boolean) => Operation.Draft(draft => { draft.meta.softDropActive = active })

export namespace StartSoftDrop {

    let autoOrInstantDrop = Operation.Provide(({ settings }) => {
        if (settings.softDropInterval == 0) {
            return instantDrop(DropScoreType.Soft);
        } else {
            return insertTimerDelayInstruction(TimerName.AutoDrop, settings.softDropInterval);
        }
    })

    export let provider = Operation.SequenceStrict(
        Drop.provider(1, DropScoreType.Soft), 
        countStep(MovementType.Drop),
        setSoftDropActive(true),
        autoOrInstantDrop
    )

}

export let cancelSoftDrop = Operation.Provide(({ settings }) => Operation.Sequence(
    insertTimerDelayInstruction(TimerName.AutoDrop, settings.dropInterval),
    setSoftDropActive(false)
))