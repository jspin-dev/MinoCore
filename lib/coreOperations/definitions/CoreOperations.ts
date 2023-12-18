import Dependencies from "./CoreDependencies";
import CoreState from "./CoreState";
import Operation from "../../definitions/Operation";
import OperationResult from "./CoreOperationResult";
import Input from "./Input";
import MovementType from "./MovementType";
import Rotation from "./Rotation";
import PieceIdentity from "../../definitions/PieceIdentifier";

interface CoreOperations<S extends CoreState, D extends Dependencies, R extends OperationResult<S>> {
    enqueueFull: Operation<R, D>
    enqueueNext: Operation<R, D>
    startDAS: Operation<R, D>
    startAutoShift: Operation<R, D>
    cancelAutoShift: Operation<R, D>
    hold: Operation<R, D>
    clearGhost: Operation<R, D>
    refreshGhost: Operation<R, D>
    hardDrop: Operation<R, D>
    lock: Operation<R, D>
    triggerLockdown: Operation<R, D>
    startSoftDrop: Operation<R, D>
    togglePause: Operation<R, D>
    start: Operation<R, D>
    initialize: Operation<R, D>
    validateRotationSettings: Operation<R, D>
    next: Operation<R, D>
    startShiftLeftInput: Operation<R, D>
    startShiftRightInput: Operation<R, D>,
    endShiftLeftInput: Operation<R, D>
    endShiftRightInput: Operation<R, D>
    prepareQueue: Operation<R, D>
    recordTick: Operation<R, D>,
    refillQueue: Operation<R, D>,
    rotate: CoreOperations.Rotate<R, D>
    move: CoreOperations.Move<R, D>
    drop: CoreOperations.Drop<R, D>
    shift: CoreOperations.Shift<R, D>
    spawn: CoreOperations.Spawn<R, D>
    clearLines: CoreOperations.ClearLines<R, D>
    updateLockStatus: CoreOperations.UpdateLockStatus<R, D>
    setSDF: CoreOperations.SetSDF<R, D>
    setARR: CoreOperations.SetARR<R, D>
    setDAS: CoreOperations.SetDAS<R, D>
    setGhostEnabled: CoreOperations.SetGhostEnabled<R, D>
    startInput: CoreOperations.StartInput<R, D>
    endInput: CoreOperations.EndInput<R, D>
    addRns: CoreOperations.AddRns<R, D>
    removeRns: CoreOperations.RemoveRns<R, D>
}    

namespace CoreOperations {

    export type Rotate<R, D> = (rotation: Rotation) => Operation<R, D>
    export type Move<R, D> = (dx: number, dy: number) => Operation<R, D>
    export type Drop<R, D> = (dy: number) => Operation<R, D>
    export type Shift<R, D> = (dx: number) => Operation<R, D>
    export type Spawn<R, D> = (pieceId: PieceIdentity) => Operation<R, D>
    export type ClearLines<R, D> = (lines: number[]) => Operation<R, D>
    export type UpdateLockStatus<R, D> = (movementType: MovementType) => Operation<R, D>
    export type SetSDF<R, D> = (softDropInterval: number) => Operation<R, D>
    export type SetARR<R, D> = (delay: number) => Operation<R, D>
    export type SetDAS<R, D> = (delay: number) => Operation<R, D>
    export type SetGhostEnabled<R, D> = (enabled: boolean) => Operation<R, D>
    export type StartInput<R, D> = (input: Input.ActiveGame) => Operation<R, D>
    export type EndInput<R, D> = (input: Input.ActiveGame) => Operation<R, D>
    export type AddRns<R, D> = (numbers: number[]) => Operation<R, D>
    export type RemoveRns<R, D> = (n: number) => Operation<R, D>

}

export default CoreOperations