import Operation from "./Operation"
import { Input, MovementType } from "./inputDefinitions"
import { Rotation } from "./rotationDefinitions"
import { DropScoreType } from "./scoring/scoringDefinitions"
import { Settings } from "./settingsDefinitions"
import { State } from "./stateTypes"

interface Dependencies<S extends State> {
    operations: Dependencies.Operations<S>
    defaultSettings: Settings
}

namespace Dependencies {

    export type Operations<S extends State> = {
        enqueueFull: Operation<S>,
        enqueueNext: Operation<S>,
        startDAS: Operation<S>,
        startAutoShift: Operation<S>,
        cancelAutoShift: Operation<S>,
        hold: Operation<S>,
        clearGhost: Operation<S>,
        refreshGhost: Operation<S>,
        hardDrop: Operation<S>,
        lock: Operation<S>,
        triggerLockdown: Operation<S>,
        startSoftDrop: Operation<S>,
        togglePause: Operation<S>,
        start: Operation<S>,
        initialize: Operation<S>,
        validateRotationSettings: Operation<S>,
        next: Operation<S>,
        startShiftLeftInput: Operation<S>,
        startShiftRightInput: Operation<S>,
        endShiftLeftInput: Operation<S>,
        endShiftRightInput: Operation<S>,
        instantShift: Operation<S>,
        prepareQueue: Operation<S>,
        syncPreviewGrid: Operation<S>,
        validatePreviewGrids: Operation<S>,
        rotate: Operations.Rotate<S>,
        move: Operations.Move<S>,
        drop: Operations.Drop<S>,
        instantDrop: Operations.InstantDrop<S>,
        shift: Operations.Shift<S>,
        spawn: Operations.Spawn<S>,
        clearLines: Operations.ClearLines<S>,
        updateLockStatus: Operations.UpdateLockStatus<S>,
        setSDF: Operations.SetSDF<S>,
        setARR: Operations.SetARR<S>,
        setDAS: Operations.SetDAS<S>,
        setGhostEnabled: Operations.SetGhostEnabled<S>,
        startInput: Operations.StartInput<S>,
        endInput: Operations.EndInput<S>,
        addRns: Operations.AddRns<S>,
        removeRns: Operations.RemoveRns<S>
    }    

    export namespace Operations {

        export type Rotate<S extends State> = (rotation: Rotation) => Operation<S>
        export type Move<S extends State> = (dx: number, dy: number) => Operation<S>
        export type Drop<S extends State> = (dy: number, scoreType: DropScoreType) => Operation<S>
        export type InstantDrop<S extends State> = (scoreType: DropScoreType) => Operation<S>
        export type Shift<S extends State> = (dx: number) => Operation<S>
        export type Spawn<S extends State> = (pieceId: number) => Operation<S>
        export type ClearLines<S extends State> = (lines: number[]) => Operation<S>
        export type UpdateLockStatus<S extends State> = (movementType: MovementType) => Operation<S>
        export type SetSDF<S extends State> = (softDropInterval: number) => Operation<S>
        export type SetARR<S extends State> = (delay: number) => Operation<S>
        export type SetDAS<S extends State> = (delay: number) => Operation<S>
        export type SetGhostEnabled<S extends State> = (enabled: boolean) => Operation<S>
        export type StartInput<S extends State> = (input: Input.ActiveGame) => Operation<S>
        export type EndInput<S extends State> = (input: Input.ActiveGame) => Operation<S>
        export type AddRns<S extends State> = (numbers: number[]) => Operation<S>
        export type RemoveRns<S extends State> = (n: number) => Operation<S>

    }

}

export default Dependencies;