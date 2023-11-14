import { TimerName } from "../definitions/metaDefinitions";

import { MovePiece } from "./movement";
import { instantShift } from "./shift";
import { Lock, UpdateLockStatus } from "./lockdown";
import { insertTimerDelayInstruction } from "./meta";
import { updateStatsOnDrop } from "./statistics";

import { provideIf } from "../util/providerUtils";
import { instantAutoShiftActive, findHardDropDistance } from "../util/stateUtils";
import { DropScoreType } from "../definitions/scoringDefinitions";
import { countStep } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { State } from "../types/stateTypes";

/**
 * Note that ghost coordinates NEVER depend on y coordinate position. If the ghost and active piece 
 * both share coordinates, the active piece will be the one displayed on the playfield grid. This will give the 
 * effect of the ghost being partially "behind" the active piece
 */
export namespace Drop {

    let continueInstantShiftIfActive = {
        provide: ({ meta, settings }: State) => {
            return provideIf(instantAutoShiftActive(meta, settings), instantShift);
        }
    }

    export let provider = (dy: number, dropScoreType: DropScoreType) => {
        return {
            requiresActiveGame: true,
            provide: () => [
                MovePiece.provider(0, dy),
                UpdateLockStatus.provider(MovementType.Drop),
                updateStatsOnDrop(dropScoreType, dy),
                continueInstantShiftIfActive
            ]
        }
    }

}

export let instantDrop = (dropScoreType: DropScoreType): Provider => {
    return {
        requiresActiveGame: true,
        provide: ({ playfield, settings }: State): Actionable => {
            let n = findHardDropDistance(playfield, settings);
            return Drop.provider(n, dropScoreType);
        }
    }
}

export let hardDrop: Provider = {
    requiresActiveGame: true,
    provide: () => [instantDrop(DropScoreType.Hard), Lock.provider]
}

let setSoftDropActive = (active: boolean): Drafter => {
    return {
        draft: draft => { draft.meta.softDropActive = active }
    }
}

export namespace StartSoftDrop {

    let autoOrInstantDrop: Provider = {
        provide: ({ settings }: State) => {
            if (settings.softDropInterval == 0) {
                return instantDrop(DropScoreType.Soft);
            } else {
                return insertTimerDelayInstruction(TimerName.AutoDrop, settings.softDropInterval);
            }
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            Drop.provider(1, DropScoreType.Soft), 
            countStep(MovementType.Drop),
            setSoftDropActive(true),
            autoOrInstantDrop
        ]
    }

}

export let cancelSoftDrop: Provider = {
    provide: ({ settings }) => {
        return [
            insertTimerDelayInstruction(TimerName.AutoDrop, settings.dropInterval),
            setSoftDropActive(false)
        ]
    }
}