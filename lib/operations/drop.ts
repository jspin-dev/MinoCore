import type { State } from "../definitions/stateDefinitions";
import type { Provider, Actionable, Drafter } from "../definitions/operationalDefinitions";
import { TimerName } from "../definitions/metaDefinitions";
import { LockStatusUpdateType } from "../definitions/lockdownDefinitions";

import { MovePiece } from "./movement";
import { instantShift } from "./shift";
import { Lock, UpdateLockStatus } from "./lockdown";
import { insertTimerDelayInstruction } from "./meta";

import { provideIf } from "../util/providerUtils";
import { instantAutoShiftActive, findHardDropDistance, } from "../util/stateUtils";

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

    export let provider = (dy: number) => {
        return {
            requiresActiveGame: true,
            provide: () => [
                MovePiece.provider(0, dy),
                UpdateLockStatus.provider(LockStatusUpdateType.OnDrop),
                continueInstantShiftIfActive
            ]
        }
    }

}

export let instantDrop: Provider = {
    requiresActiveGame: true,
    provide: ({ playfield, settings }: State): Actionable => {
        let n = findHardDropDistance(playfield, settings);
        return Drop.provider(n);
    }
}

export let hardDrop: Provider = {
    requiresActiveGame: true,
    provide: () => [instantDrop, Lock.provider]
}

export namespace StartSoftDrop {

    let setInstantSoftDropActive: Drafter =  {
        draft: draft => { draft.meta.instantSoftDropActive = true }
    }

    let autoOrInstantDrop: Provider = {
        provide: ({ settings }: State) => {
            if (settings.softDropInterval == 0) {
                return [
                    setInstantSoftDropActive,
                    instantDrop
                ];
            } else {
                return insertTimerDelayInstruction(TimerName.AutoDrop, settings.softDropInterval);
            }
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [Drop.provider(1), autoOrInstantDrop]
    }

}

export namespace CancelSoftDrop {

    let restartNormalDrop: Provider = {
        provide: ({ settings }: State) => {
            return insertTimerDelayInstruction(TimerName.AutoDrop, settings.dropInterval)
        }
    }

    let setInstantSoftDropInactive: Drafter =  {
        draft: draft => { draft.meta.instantSoftDropActive = false }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            restartNormalDrop,
            setInstantSoftDropInactive
        ]
    }

}