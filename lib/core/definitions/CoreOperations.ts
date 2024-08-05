import  Dependencies from "./CoreDependencies"
import type CoreState from "./CoreState"
import type OperationResult from "./CoreOperationResult"
import type MovementType from "../../definitions/MovementType"
import type Rotation from "../../definitions/Rotation"
import type PieceIdentity from "../../definitions/PieceIdentifier"
import ShiftDirection from "../../definitions/ShiftDirection"
import DropType from "../../definitions/DropType"
import Operation from "../../definitions/Operation"
import Input from "../../definitions/Input";
import startDAS from "../operations/secondary/movement/startDAS";
import startAutoShift from "../operations/secondary/movement/startAutoShift";
import hold from "../operations/secondary/hold";
import refreshGhost from "../operations/tertiary/refreshGhost";
import lock from "../operations/secondary/lock";
import startSoftDrop from "../operations/secondary/movement/startSoftDrop";
import next from "../operations/secondary/next";
import refillQueue from "../operations/tertiary/refillQueue";
import completePendingMovement from "../operations/tertiary/completePendingMovement";
import continueInstantDrop from "../operations/tertiary/continueInstantDrop";
import continueInstantShift from "../operations/tertiary/continueInstantShift";
import hardDrop from "../operations/secondary/movement/hardDrop";
import cancelSoftDrop from "../operations/secondary/movement/cancelSoftDrop";
import initialize from "../operations/primary/initialize";
import start from "../operations/primary/start";
import spawn from "../operations/secondary/spawn";
import rotate from "../operations/secondary/movement/rotate";
import drop from "../operations/secondary/movement/drop";
import shift from "../operations/secondary/movement/shift";
import updateLockStatus from "../operations/tertiary/updateLockStatus";
import startShiftInput from "../operations/secondary/movement/startShiftInput";
import endShiftInput from "../operations/secondary/movement/endShiftInput";
import triggerLockdown from "../operations/tertiary/triggerLockdown";
import addRns from "../operations/primary/addRns";
import startInput from "../operations/primary/startInput";
import endInput from "../operations/primary/endInput";
import restart from "../operations/primary/restart";
import CoreDependencies from "./CoreDependencies";

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
    triggerLockdown: Operation<R, D>
    initialize: Operation<R, D>,
    start: Operation<R, D>,
    rotate: CoreOperations.Builders.Rotate<R, D>
    drop: CoreOperations.Builders.Drop<R, D>
    shift: CoreOperations.Builders.Shift<R, D>
    spawn: CoreOperations.Builders.Spawn<R, D>
    updateLockStatus: CoreOperations.Builders.UpdateLockStatus<R, D>
    startShiftInput: CoreOperations.Builders.StartShiftInput<R, D>,
    endShiftInput: CoreOperations.Builders.EndShiftInput<R, D>,
    addRns: CoreOperations.Builders.AddRns<R, D>,
    startInput: CoreOperations.Builders.StartInput<R, D>,
    endInput: CoreOperations.Builders.EndInput<R, D>
    restart: CoreOperations.Builders.Restart<R, D>,
}

namespace CoreOperations {

    export namespace Builders {

        export type Rotate<R, D> = (rotation: Rotation) => Operation<R, D>
        export type Move<R, D> = (dx: number, dy: number) => Operation<R, D>
        export type Drop<R, D> = (type: DropType, dy: number) => Operation<R, D>
        export type Shift<R, D> = (dx: number) => Operation<R, D>
        export type Spawn<R, D> = (pieceId: PieceIdentity) => Operation<R, D>
        export type UpdateLockStatus<R, D> = (movementType: MovementType) => Operation<R, D>
        export type StartShiftInput<R, D> = (direction: ShiftDirection) => Operation<R, D>
        export type EndShiftInput<R, D> = (direction: ShiftDirection) => Operation<R, D>
        export type AddRns<R, D> = (numbers: number[]) => Operation<R, D>
        export type StartInput<R, D> = (input: Input.ActiveGame) => Operation<R, D>
        export type EndInput<R, D> = (input: Input.ActiveGame) => Operation<R, D>
        export type Restart<R, D> = (numbers: number[]) => Operation<R, D>

    }

    export const defaults = {
        startDAS,
        startAutoShift,
        hold,
        refreshGhost,
        lock,
        startSoftDrop,
        next,
        refillQueue,
        completePendingMovement,
        continueInstantDrop,
        continueInstantShift,
        hardDrop,
        cancelSoftDrop,
        initialize,
        start,
        spawn,
        rotate,
        drop,
        shift,
        updateLockStatus,
        startShiftInput,
        endShiftInput,
        triggerLockdown,
        addRns,
        startInput,
        endInput,
        restart
    } satisfies CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>

}

export default CoreOperations