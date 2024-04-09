import type Dependencies from "./CoreDependencies"
import type CoreState from "./CoreState"
import type ReducerResult from "./CoreReducerResult"
import type MovementType from "../../definitions/MovementType"
import type Rotation from "../../definitions/Rotation"
import type PieceIdentity from "../../definitions/PieceIdentifier"
import ShiftDirection from "../../definitions/ShiftDirection"
import DropType from "../../definitions/DropType"
import Reducer from "../../definitions/Reducer"

interface CoreReducers<S extends CoreState, D extends Dependencies, R extends ReducerResult<S>> {
    startDAS: Reducer<R, D>
    startAutoShift: Reducer<R, D>
    hold: Reducer<R, D>
    refreshGhost: Reducer<R, D>
    lock: Reducer<R, D>
    startSoftDrop: Reducer<R, D>
    next: Reducer<R, D>
    refillQueue: Reducer<R, D>
    completePendingMovement: Reducer<R, D>,
    continueInstantShift: Reducer<R, D>,
    continueInstantDrop: Reducer<R, D>,
    hardDrop: Reducer<R, D>
    cancelSoftDrop: Reducer<R, D>
    triggerLockdown: Reducer<R, D>
    rotate: CoreReducers.Rotate<R, D>
    drop: CoreReducers.Drop<R, D>
    shift: CoreReducers.Shift<R, D>
    spawn: CoreReducers.Spawn<R, D>
    updateLockStatus: CoreReducers.UpdateLockStatus<R, D>
    startShiftInput: CoreReducers.StartShiftInput<R, D>,
    endShiftInput: CoreReducers.EndShiftInput<R, D>
}

namespace CoreReducers {

    export type Rotate<R, D> = (rotation: Rotation) => Reducer<R, D>
    export type Move<R, D> = (dx: number, dy: number) => Reducer<R, D>
    export type Drop<R, D> = (type: DropType, dy: number) => Reducer<R, D>
    export type Shift<R, D> = (dx: number) => Reducer<R, D>
    export type Spawn<R, D> = (pieceId: PieceIdentity) => Reducer<R, D>
    export type UpdateLockStatus<R, D> = (movementType: MovementType) => Reducer<R, D>
    export type StartShiftInput<R, D> = (direction: ShiftDirection) => Reducer<R, D>
    export type EndShiftInput<R, D> = (direction: ShiftDirection) => Reducer<R, D>

}

export default CoreReducers