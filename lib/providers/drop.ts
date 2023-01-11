import type { State } from "../definitions/stateDefinitions";
import type { Provider, Actionable, Operation } from "../definitions/operationalDefinitions";
import { TimerName } from "../definitions/metaDefinitions";
import { LockStatusUpdateType } from "../definitions/lockdownDefinitions";

import MetaDrafters from "../drafters/metaDrafters";
import { MovePiece } from "./movement";
import { instantShift } from "./shift";
import { Lock, UpdateLockStatus } from "./lockdown";

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
                MovePiece.move(0, dy),
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

    let autoOrInstantDrop: Provider = {
        provide: ({ settings }: State) => {
            if (settings.softDropInterval == 0) {
                return [
                    MetaDrafters.Makers.setInstantSoftDropActive(true),
                    instantDrop
                ];
            } else {
                return MetaDrafters.Makers.insertTimerDelayChange(TimerName.AutoDrop,settings.softDropInterval);
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
            return MetaDrafters.Makers.insertTimerDelayChange(TimerName.AutoDrop, settings.dropInterval)
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            restartNormalDrop,
            MetaDrafters.Makers.setInstantSoftDropActive(false)
        ]
    }

}