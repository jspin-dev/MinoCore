import CoreDependencies from "./CoreDependencies";
import CoreState from "./CoreState";
import Operation from "./Operation";
import { OperationResult } from "./OperationResult";
import { Input, MovementType } from "./inputDefinitions";
import { Rotation } from "./rotationDefinitions";
import { DropScoreType } from "./scoring/scoringDefinitions";

type CoreOperations<S extends CoreState, D extends CoreDependencies, R extends OperationResult<CoreState>> = {
    enqueueFull: Operation<S, D, R>,
    enqueueNext: Operation<S, D, R>,
    startDAS: Operation<S, D, R>,
    startAutoShift: Operation<S, D, R>,
    cancelAutoShift: Operation<S, D, R>,
    hold: Operation<S, D, R>,
    clearGhost: Operation<S, D, R>,
    refreshGhost: Operation<S, D, R>,
    hardDrop: Operation<S, D, R>,
    lock: Operation<S, D, R>,
    triggerLockdown: Operation<S, D, R>,
    startSoftDrop: Operation<S, D, R>,
    togglePause: Operation<S, D, R>,
    start: Operation<S, D, R>,
    initialize: Operation<S, D, R>,
    validateRotationSettings: Operation<S, D, R>,
    next: Operation<S, D, R>,
    startShiftLeftInput: Operation<S, D, R>,
    startShiftRightInput: Operation<S, D, R>,
    endShiftLeftInput: Operation<S, D, R>,
    endShiftRightInput: Operation<S, D, R>,
    prepareQueue: Operation<S, D, R>,
    syncPreviewGrid: Operation<S, D, R>,
    validatePreviewGrids: Operation<S, D, R>,
    recordTick: Operation<S, D, R>,
    rotate: CoreOperations.Rotate<S, D, R>,
    move: CoreOperations.Move<S, D, R>,
    drop: CoreOperations.Drop<S, D, R>,
    shift: CoreOperations.Shift<S, D, R>,
    spawn: CoreOperations.Spawn<S, D, R>,
    clearLines: CoreOperations.ClearLines<S, D, R>,
    updateLockStatus: CoreOperations.UpdateLockStatus<S, D, R>,
    setSDF: CoreOperations.SetSDF<S, D, R>,
    setARR: CoreOperations.SetARR<S, D, R>,
    setDAS: CoreOperations.SetDAS<S, D, R>,
    setGhostEnabled: CoreOperations.SetGhostEnabled<S, D, R>,
    startInput: CoreOperations.StartInput<S, D, R>,
    endInput: CoreOperations.EndInput<S, D, R>,
    addRns: CoreOperations.AddRns<S, D, R>,
    removeRns: CoreOperations.RemoveRns<S, D, R>
}    

namespace CoreOperations {

    export type Rotate<S, D, R> = (rotation: Rotation) => Operation<S, D, R>
    export type Move<S, D, R> = (dx: number, dy: number) => Operation<S, D, R>
    export type Drop<S, D, R> = (dy: number, scoreType: DropScoreType) => Operation<S, D, R>
    export type Shift<S, D, R> = (dx: number) => Operation<S, D, R>
    export type Spawn<S, D, R> = (pieceId: number) => Operation<S, D, R>
    export type ClearLines<S, D, R> = (lines: number[]) => Operation<S, D, R>
    export type UpdateLockStatus<S, D, R> = (movementType: MovementType) => Operation<S, D, R>
    export type SetSDF<S, D, R> = (softDropInterval: number) => Operation<S, D, R>
    export type SetARR<S, D, R> = (delay: number) => Operation<S, D, R>
    export type SetDAS<S, D, R> = (delay: number) => Operation<S, D, R>
    export type SetGhostEnabled<S, D, R> = (enabled: boolean) => Operation<S, D, R>
    export type StartInput<S, D, R> = (input: Input.ActiveGame) => Operation<S, D, R>
    export type EndInput<S, D, R> = (input: Input.ActiveGame) => Operation<S, D, R>
    export type AddRns<S, D, R> = (numbers: number[]) => Operation<S, D, R>
    export type RemoveRns<S, D, R>= (n: number) => Operation<S, D, R>

}

export default CoreOperations