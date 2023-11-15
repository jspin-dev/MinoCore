import { ShiftDirection } from "../definitions/playfieldDefinitions";

import { refreshGhost } from "./ghost";
import { cancelAutoShift, insertTimerOperation } from "./meta";
import { MovePiece } from "./movement";
import { StartSoftDrop } from "./drop";
import { UpdateLockStatus } from "./lockdown";
import { checkCollision } from "../util/stateUtils";
import { countStep } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { instantSoftDropActive } from "../util/stateUtils";
import { Operation } from "../definitions/operationalDefinitions";
import { TimerName, TimerOperation } from "../definitions/metaDefinitions";

export namespace DasDirection {
        
    export let setRightCharged = (isCharged: boolean) => Operation.Draft(draft => { 
        draft.meta.dasRightCharged = isCharged 
    })

    export let setLeftCharged = (isCharged: boolean) => Operation.Draft(draft => { 
        draft.meta.dasLeftCharged = isCharged 
    })

    export let setDirection = (direction: ShiftDirection) => Operation.Draft(draft => { 
        draft.meta.direction = direction 
    })

}

export namespace Shift {

    let movementProviderMaker = (dx: number): Operation.Any => {
        if (dx < 0) {
            throw "Dx must be a positive integer. This function already uses meta.direction to decide left/right"
        }
        return Operation.Provide(state => MovePiece.provider(dx * state.meta.direction, 0))
    }
    
    let continueInstantSoftDropIfActive = Operation.Provide(({ meta, settings }) => {
        return Operation.applyIf(instantSoftDropActive(meta, settings), StartSoftDrop.provider)
    })

    export let provider = (dx: number) => Operation.SequenceStrict(
        movementProviderMaker(dx),
        refreshGhost,
        UpdateLockStatus.provider(MovementType.Shift),
        continueInstantSoftDropIfActive
    )

}

export let instantShift = Operation.ProvideStrict(({ meta, playfield, settings }) => {
    let activePieceCoordinates = playfield.activePiece.coordinates;
    let direction = meta.direction;
    if (checkCollision(activePieceCoordinates, direction, 0, playfield, settings)) {
        return Operation.None;
    }

    let horizontalCollision: boolean, dx = 0;
    while (!horizontalCollision) {
        dx += direction;
        horizontalCollision = checkCollision(activePieceCoordinates, dx, 0, playfield, settings);
    }

    let shiftMagnitude = Math.abs(dx - direction); // Shift function expects a positive integer
    return Shift.provider(shiftMagnitude);
}) 

export namespace StartDAS {

    let mainProvider = Operation.Provide(({ settings }) => {
        if (settings.das === 0) {
            return StartAutoShift.provider
        } else {
            return insertTimerOperation(TimerName.DAS, TimerOperation.Start)
        }
    }, {
        description: "Start shifting if DAS is 0, otherwise start DAS"
    })

    let providePreIntervalShift = Operation.Provide(({ settings }) => {
        return Operation.applyIf(settings.dasPreIntervalShift, Shift.provider(1))
    })

    export let provider = Operation.SequenceStrict(
        providePreIntervalShift,
        cancelAutoShift,
        mainProvider
    )
    
}

export namespace StartShiftRightInput {

    // Why are we just setting DAS left charged to true?
    let chargeProvider = Operation.Provide(({ settings }) => {
        return Operation.applyIf(!settings.dasInteruptionEnabled, DasDirection.setLeftCharged(true));
    })

    export let provider = Operation.SequenceStrict(
        DasDirection.setDirection(ShiftDirection.Right),
        chargeProvider,
        StartDAS.provider,
        countStep(MovementType.Shift)
    )

}

export namespace EndShiftRightInput {

    let instantShiftProvider = Operation.Provide(({ settings }) => {
        return Operation.applyIf(settings.arr === 0, instantShift)
    })

    let invertDirectionProvider = Operation.Provide(({ settings, meta }) => {
        let shouldInvertDirection = settings.dasInteruptionEnabled && meta.dasLeftCharged;
        return Operation.applyIf(shouldInvertDirection, Operation.Sequence(
            DasDirection.setDirection(ShiftDirection.Left),
            instantShiftProvider
        ));
    })
    let cancelAutoShiftProvider = Operation.Provide(({ meta }) => {
        return Operation.applyIf(meta.direction == ShiftDirection.Right, cancelAutoShift)
    })

    export let provider = Operation.SequenceStrict(
        DasDirection.setRightCharged(false),
        invertDirectionProvider,
        cancelAutoShiftProvider
    )
}

export namespace StartShiftLeftInput {

    // Why are we just setting DAS right charged to true?
    let chargeProvider = Operation.Provide(({ settings }) => {
        let shouldCharge = !settings.dasInteruptionEnabled
        return Operation.applyIf(shouldCharge, DasDirection.setRightCharged(true))
    })

    export let provider = Operation.Sequence(
        DasDirection.setDirection(ShiftDirection.Left),
        chargeProvider,
        StartDAS.provider,
        countStep(MovementType.Shift)
    )

}

export namespace EndShiftLeftInput {

    let instantShiftProvider = Operation.Provide(({ settings }) => Operation.applyIf(settings.arr === 0, instantShift))

    let invertDirectionProvider = Operation.Provide(({ settings, meta }) => {
        let shouldInvertDirection = settings.dasInteruptionEnabled && meta.dasRightCharged;
        return Operation.applyIf(shouldInvertDirection, Operation.Sequence(
            DasDirection.setDirection(ShiftDirection.Right),
            instantShiftProvider
        ))
    })
    let cancelAutoShiftProvider = Operation.Provide(({ meta }) => {
        return Operation.applyIf(meta.direction == ShiftDirection.Left, cancelAutoShift)
    })

    export let provider = Operation.SequenceStrict(
        DasDirection.setLeftCharged(false),
        invertDirectionProvider,
        cancelAutoShiftProvider
    )

}

export namespace StartAutoShift {

    let chargeProvider = Operation.Provide(({ meta }) => {
        if (meta.direction == ShiftDirection.Right) {
            return DasDirection.setRightCharged(true);
        } else if (meta.direction == ShiftDirection.Left) {
            return DasDirection.setLeftCharged(true);
        } else {
            return Operation.None;
        }
    })

    let shiftProvider = Operation.Provide (({ settings }) => {
        return settings.arr == 0 
            ? instantShift 
            : insertTimerOperation(TimerName.AutoShift, TimerOperation.Start);
    })

    export let provider = Operation.SequenceStrict(chargeProvider, shiftProvider)

}