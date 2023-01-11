import type { Provider, Actionable, Operation } from "../definitions/operationalDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { ShiftDirection } from "../definitions/playfieldDefinitions";
import { TimerName, TimerOperation } from "../definitions/metaDefinitions";
import { LockStatusUpdateType } from "../definitions/lockdownDefinitions";

import { refreshGhostPlacement } from "./playfield";
import { cancelAutoShift } from "./meta";
import MetaDrafters from "../drafters/metaDrafters";
import { MovePiece } from "./movement";
import { StartSoftDrop } from "./drop";
import { UpdateLockStatus } from "./lockdown";
import { provideIf } from "../util/providerUtils";
import { checkCollision } from "../util/stateUtils";

export namespace Shift {

    let movementProviderMaker = (dx: number): Provider => {
        if (dx < 0) {
            throw "Dx must be a positive integer. This function already uses meta.direction to decide left/right"
        }
        return {
            provide: state => MovePiece.move(dx * state.meta.direction, 0)
        }
    }
    
    let continueInstantSoftDropIfActive: Provider = {
        provide: state => provideIf(state.meta.instantSoftDropActive, StartSoftDrop.provider)
    }
    
    export let provider = (dx: number) => {
        return {
            requiresActiveGame: true,
            provide: () => [
                movementProviderMaker(dx),
                refreshGhostPlacement,
                UpdateLockStatus.provider(LockStatusUpdateType.OnShift),
                continueInstantSoftDropIfActive
            ]
        }
    }

}

export let instantShift: Provider = {
    requiresActiveGame: true,
    provide: ({ meta, playfield, settings }: State): Actionable => {
        let activePieceCoordinates = playfield.activePiece.coordinates;
        let direction = meta.direction;
        if (checkCollision(activePieceCoordinates, direction, 0, playfield, settings)) {
            return [];
        }
    
        let horizontalCollision: boolean, dx = 0;
        while (!horizontalCollision) {
            dx += direction;
            horizontalCollision = checkCollision(activePieceCoordinates, dx, 0, playfield, settings);
        }
    
        let shiftMagnitude = Math.abs(dx - direction); // Shift function expects a positive integer
        return Shift.provider(shiftMagnitude);
    }
}

export namespace StartDAS {

    let mainProvider = {
        log: "Start shifting if DAS is 0, otherwise start DAS",
        provide: ({ settings }: State) => {
            if (settings.das === 0) {
                return StartAutoShift.provider
            } else {
                return MetaDrafters.Makers.insertTimerOperation(TimerName.DAS, TimerOperation.Start)
            }
        }
    }

    let providePreIntervalShift: Provider = {
        provide: ({ settings }: State) => provideIf(settings.dasPreIntervalShift, Shift.provider(1))
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            providePreIntervalShift,
            cancelAutoShift,
            mainProvider
        ]
    }
    
}

export namespace StartShiftRightInput {

    // Why are we just setting DAS left charged to true?
    let chargeProvider = {
        provide: ({ settings }: State) => {
            return provideIf(!settings.dasInteruptionEnabled, MetaDrafters.Makers.setDASLeftCharged(true));
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            MetaDrafters.Makers.setDirection(ShiftDirection.Right),
            chargeProvider,
            StartDAS.provider
        ]
    }

}

export namespace EndShiftRightInput {

    let instantShiftProvider = {
        provide: ({ settings }: State) => {
            return provideIf(settings.arr === 0, instantShift)
        }
    }
    let invertDirectionProvider = {
        provide: ({ settings, meta }: State) => {
            let shouldInvertDirection = settings.dasInteruptionEnabled && meta.dasLeftCharged;
            return provideIf(shouldInvertDirection, [
                MetaDrafters.Makers.setDirection(ShiftDirection.Left),
                instantShiftProvider
            ]);
        }
    }
    let cancelAutoShiftProvider = {
        provide: ({ meta }: State) => {
            return provideIf(meta.direction == ShiftDirection.Right, cancelAutoShift)
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            MetaDrafters.Makers.setDASRightCharged(false),
            invertDirectionProvider,
            cancelAutoShiftProvider
        ]
    }

}

export namespace StartShiftLeftInput {

    // Why are we just setting DAS right charged to true?
    let chargeProvider: Provider = {
        provide: ({ settings }: State) => {
            let shouldCharge = !settings.dasInteruptionEnabled
            return provideIf(shouldCharge, MetaDrafters.Makers.setDASRightCharged(true))
        }    
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            MetaDrafters.Makers.setDirection(ShiftDirection.Left),
            chargeProvider,
            StartDAS.provider
        ]
    }

}

export namespace EndShiftLeftInput {

    let instantShiftProvider = {
        provide: ({ settings }: State) => {
            return provideIf(settings.arr === 0, instantShift)
        }
    }
    let invertDirectionProvider = {
        provide: ({ settings, meta }: State) => {
            let shouldInvertDirection = settings.dasInteruptionEnabled && meta.dasRightCharged;
            return provideIf(shouldInvertDirection, [
                MetaDrafters.Makers.setDirection(ShiftDirection.Right),
                instantShiftProvider
            ])
        }
    }
    let cancelAutoShiftProvider = {
        provide: ({ meta }: State) => {
            return provideIf(meta.direction == ShiftDirection.Left, cancelAutoShift)
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            MetaDrafters.Makers.setDASLeftCharged(false),
            invertDirectionProvider,
            cancelAutoShiftProvider
        ]
    }

}

export namespace StartAutoShift {

    let chargeProvider: Provider = {
        provide: ({ meta }: State) => {
            if (meta.direction == ShiftDirection.Right) {
                return MetaDrafters.Makers.setDASRightCharged(true);
            } else if (meta.direction == ShiftDirection.Left) {
                return MetaDrafters.Makers.setDASLeftCharged(true);
            } else {
                return [];
            }
        }
    }
    let shiftProvider: Provider = {
        provide: ({ settings }: State) => {
            return settings.arr == 0 
                ? instantShift 
                : MetaDrafters.Makers.insertTimerOperation(TimerName.AutoShift, TimerOperation.Start);
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [chargeProvider, shiftProvider]
    }

}