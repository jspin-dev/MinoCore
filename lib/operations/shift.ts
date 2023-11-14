import { ShiftDirection } from "../definitions/playfieldDefinitions";
import { TimerName, TimerOperation } from "../definitions/metaDefinitions";

import { refreshGhost } from "./ghost";
import { cancelAutoShift, insertTimerOperation } from "./meta";
import { MovePiece } from "./movement";
import { StartSoftDrop } from "./drop";
import { UpdateLockStatus } from "./lockdown";
import { provideIf } from "../util/providerUtils";
import { checkCollision } from "../util/stateUtils";
import { countStep } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { instantSoftDropActive } from "../util/stateUtils";
import { State } from "../types/stateTypes";

export namespace Shift {

    let movementProviderMaker = (dx: number): Provider => {
        if (dx < 0) {
            throw "Dx must be a positive integer. This function already uses meta.direction to decide left/right"
        }
        return {
            provide: state => MovePiece.provider(dx * state.meta.direction, 0)
        }
    }
    
    let continueInstantSoftDropIfActive: Provider = {
        provide: ({ meta, settings }) => provideIf(instantSoftDropActive(meta, settings), StartSoftDrop.provider)
    }
    
    export let provider = (dx: number) => {
        return {
            requiresActiveGame: true,
            provide: () => [
                movementProviderMaker(dx),
                refreshGhost,
                UpdateLockStatus.provider(MovementType.Shift),
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
                return insertTimerOperation(TimerName.DAS, TimerOperation.Start)
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
            return provideIf(!settings.dasInteruptionEnabled, DasDirection.setLeftCharged(true));
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            DasDirection.setDirection(ShiftDirection.Right),
            chargeProvider,
            StartDAS.provider,
            countStep(MovementType.Shift)
        ]
    }

}

namespace DasDirection {

        
    export let setRightCharged = (isCharged: boolean): Drafter => {
        return {
            draft: draft => { draft.meta.dasRightCharged = isCharged }
        }
    }

    export let setLeftCharged = (isCharged: boolean): Drafter => {
        return {
            draft: draft => { draft.meta.dasLeftCharged = isCharged }
        }
    }

    export let setDirection = (direction: ShiftDirection): Drafter => {
        return {
            draft: draft => { draft.meta.direction = direction }
        }
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
                DasDirection.setDirection(ShiftDirection.Left),
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
            DasDirection.setRightCharged(false),
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
            return provideIf(shouldCharge, DasDirection.setRightCharged(true))
        }    
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            DasDirection.setDirection(ShiftDirection.Left),
            chargeProvider,
            StartDAS.provider,
            countStep(MovementType.Shift)
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
                DasDirection.setDirection(ShiftDirection.Right),
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
            DasDirection.setLeftCharged(false),
            invertDirectionProvider,
            cancelAutoShiftProvider
        ]
    }

}

export namespace StartAutoShift {

    let chargeProvider: Provider = {
        provide: ({ meta }: State) => {
            if (meta.direction == ShiftDirection.Right) {
                return DasDirection.setRightCharged(true);
            } else if (meta.direction == ShiftDirection.Left) {
                return DasDirection.setLeftCharged(true);
            } else {
                return [];
            }
        }
    }
    let shiftProvider: Provider = {
        provide: ({ settings }: State) => {
            return settings.arr == 0 
                ? instantShift 
                : insertTimerOperation(TimerName.AutoShift, TimerOperation.Start);
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [chargeProvider, shiftProvider]
    }

}