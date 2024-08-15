import PendingMovement from "./PendingMovement"
import Input from "../../definitions/Input"
import ActivePiece from "../../definitions/ActivePiece"
import GameStatus from "./GameStatus"
import ShiftDirection from "../../definitions/ShiftDirection"
import type PieceIdentifier from "../../definitions/PieceIdentifier"
import Playfield from "../../definitions/Playfield"
import Settings from "../../settings/definitions/Settings"
import ShiftPair from "../../definitions/ShiftPair"
import {arraysEqual, createEmptyGrid} from "../../util/sharedUtils"
import GameSchema from "../../schema/definitions/GameSchema"
import Cell from "../../definitions/Cell"

interface CoreState {
    previewQueue: PieceIdentifier[],
    activePiece?: ActivePiece | null,
    playfield: Playfield,
    holdEnabled: boolean,
    holdPiece?: PieceIdentifier,
    settings: Settings,
    status: GameStatus,
    activeInputs: Input.ActiveGame[],
    pendingMovement?: PendingMovement | null,
    dasCharged: ShiftPair<boolean>,
    shiftDirection: ShiftDirection,
    randomNumbers: number[]
}

namespace CoreState {

    export const initial = (settings: Settings, schema: GameSchema, randomNumbers: number[]): CoreState => {
        return {
            previewQueue: [],
            activePiece: null,
            playfield: createEmptyGrid(schema.playfieldDimens.rows, schema.playfieldDimens.columns, Cell.Empty),
            holdEnabled: true,
            holdPiece: null,
            settings,
            status: GameStatus.Ready,
            activeInputs: [],
            pendingMovement: null,
            dasCharged: {
                [ShiftDirection.Left]: false,
                [ShiftDirection.Right]: false
            },
            shiftDirection: null,
            randomNumbers: randomNumbers
        }
    }

}

// Diff utils
namespace CoreState {

    export interface Diff {
        partial?: Omit<Partial<CoreState>, "activePiece" | "playfield" | "settings">,
        activePiece?: ActivePiece.Diff,
        playfield?: Playfield.Diff,
        settings?: Settings.Diff
    }

    export const diff = (before: CoreState, after: CoreState) => {
        if (!after) {
            return null
        }
        if (!before) {
            return { partial: after } satisfies Diff
        }
        const partial: Partial<CoreState> = {}
        if (!arraysEqual(before.previewQueue, after.previewQueue)) {
            partial.previewQueue = after.previewQueue
        }
        if (before.holdEnabled != after.holdEnabled) {
            partial.holdEnabled = after.holdEnabled
        }
        if (before.holdPiece != after.holdPiece) {
            partial.holdPiece = after.holdPiece
        }
        if (before.status != after.status) {
            partial.status = after.status
        }
        if (!arraysEqual(before.activeInputs, after.activeInputs, Input.ActiveGame.equal)) {
            partial.activeInputs = after.activeInputs
        }
        if (!PendingMovement.equal(before.pendingMovement, after.pendingMovement)) {
            partial.pendingMovement = after.pendingMovement
        }
        if (before.dasCharged[ShiftDirection.Left] != after.dasCharged[ShiftDirection.Left]
            || before.dasCharged[ShiftDirection.Right] != after.dasCharged[ShiftDirection.Right]) {
            partial.dasCharged = after.dasCharged
        }
        if (before.shiftDirection != after.shiftDirection) {
            partial.shiftDirection = after.shiftDirection
        }
        if (!arraysEqual(before.randomNumbers, after.randomNumbers)) {
            partial.randomNumbers = after.randomNumbers
        }

        const diff: Diff = { partial }
        let activePieceDiff = ActivePiece.diff(before.activePiece, after.activePiece)
        if (activePieceDiff) {
            diff.activePiece = activePieceDiff
        }
        let playfieldDiff = Playfield.diff(before.playfield, after.playfield)
        if (playfieldDiff) {
            diff.playfield = playfieldDiff
        }
        let returnValue = Object.keys(diff).length > 0 ? diff : null
        return returnValue satisfies Diff
    }

}

export default CoreState