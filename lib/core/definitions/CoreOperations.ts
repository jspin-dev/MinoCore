import type Dependencies from "./CoreDependencies"
import type CoreState from "./CoreState"
import type Operation from "../../definitions/Operation"
import type OperationResult from "./CoreOperationResult"
import type MovementType from "../../definitions/MovementType"
import type Rotation from "../../definitions/Rotation"
import type PieceIdentity from "../../definitions/PieceIdentifier"
import ShiftDirection from "../../definitions/ShiftDirection"
import DropType from "../../definitions/DropType"

interface CoreOperations<S extends CoreState, D extends Dependencies, R extends OperationResult<S>> {
    startDAS: Operation<R, D>
    startAutoShift: Operation<R, D>
    hold: Operation<R, D>
    refreshGhost: Operation<R, D>
    lock: Operation<R, D>
    startSoftDrop: Operation<R, D>
    next: Operation<R, D>
    refillQueue: Operation<R, D>
    completePendingMovement: Operation<R, D>,
    continueInstantShift: Operation<R, D>,
    continueInstantDrop: Operation<R, D>,
    hardDrop: Operation<R, D>
    cancelSoftDrop: Operation<R, D>
    rotate: CoreOperations.Rotate<R, D>
    drop: CoreOperations.Drop<R, D>
    shift: CoreOperations.Shift<R, D>
    spawn: CoreOperations.Spawn<R, D>
    updateLockStatus: CoreOperations.UpdateLockStatus<R, D>
    clearLines: CoreOperations.ClearLines<R, D>,
    startShiftInput: CoreOperations.StartShiftInput<R, D>,
    endShiftInput: CoreOperations.EndShiftInput<R, D>
}    

namespace CoreOperations {

    export type Rotate<R, D> = (rotation: Rotation) => Operation<R, D>
    export type Move<R, D> = (dx: number, dy: number) => Operation<R, D>
    export type Drop<R, D> = (type: DropType, dy: number) => Operation<R, D>
    export type Shift<R, D> = (dx: number) => Operation<R, D>
    export type Spawn<R, D> = (pieceId: PieceIdentity) => Operation<R, D>
    export type UpdateLockStatus<R, D> = (movementType: MovementType) => Operation<R, D>
    export type ClearLines<R, D> = (lines: number[]) => Operation<R, D>
    export type StartShiftInput<R, D> = (direction: ShiftDirection) => Operation<R, D>
    export type EndShiftInput<R, D> = (direction: ShiftDirection) => Operation<R, D>

}

export default CoreOperations