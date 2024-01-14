import PendingMovement from "./PendingMovement"
import Input from "../../definitions/Input"
import type Settings from "./Settings"
import ActivePiece from "../../definitions/ActivePiece"
import GameStatus from "./GameStatus"
import ShiftDirection from "../../definitions/ShiftDirection"
import type PieceIdentifier from "../../definitions/PieceIdentifier"
import Playfield from "../../definitions/Playfield"
import LockdownStatus from "./LockdownStatus"
import Coordinate from "../../definitions/Coordinate"
import Cell from "../../definitions/Cell"
import ShiftPair from "../../definitions/ShiftPair"
import { arraysEqual } from "../../util/sharedUtils"

interface CoreState {
    previewQueue: PieceIdentifier[],
    activePiece: ActivePiece,
    playfield: Playfield,
    lockdownStatus: LockdownStatus,
    holdEnabled: boolean,
    holdPiece?: PieceIdentifier,
    settings: Settings,
    status: GameStatus,
    activeInputs: Input.ActiveGame[],
    pendingMovement?: PendingMovement,
    dasCharged: ShiftPair<boolean>,
    shiftDirection: ShiftDirection,
    randomNumbers: number[]
}

namespace CoreState {

    export const initial: CoreState = {
        previewQueue: [],
        activePiece: ActivePiece.initial,
        playfield: null,
        lockdownStatus: LockdownStatus.NoLockdown,
        holdEnabled: true,
        holdPiece: null,
        settings: null,
        status: GameStatus.Ready,
        activeInputs: [],
        pendingMovement: null,
        dasCharged: {
          [ShiftDirection.Left]: false,
          [ShiftDirection.Right]: false
        },
        shiftDirection: null,
        randomNumbers: []
    }

}

// Diff utils
namespace CoreState {

    export interface Diff {
        previewQueue?: PieceIdentifier[],
        activePiece?: ActivePiece.Diff,
        playfield?: Playfield.Diff,
        lockdownStatus?: LockdownStatus,
        holdEnabled?: boolean,
        holdPiece?: PieceIdentifier,
        settings?: Settings.Diff,
        status?: GameStatus,
        activeInputs?: Input.ActiveGame[],
        pendingMovement?: PendingMovement,
        dasCharged?: ShiftPair<boolean>,
        shiftDirection?: ShiftDirection,
        randomNumbers?: number[]
    }

    export const diff = (before: CoreState, after: CoreState) => {
        if (!after) {
            return null
        }
        if (!before) {
            return {
                previewQueue: after.previewQueue,
                activePiece: after.activePiece,
                playfield: Playfield.Diff.Grid(after.playfield),
                lockdownStatus: after.lockdownStatus,
                holdEnabled: after.holdEnabled,
                holdPiece: after.holdPiece,
                //settings?: Settings.Update,
                status: after.status,
                activeInputs: after.activeInputs,
                pendingMovement: after.pendingMovement,
                dasCharged: after.dasCharged,
                shiftDirection: after.shiftDirection,
                randomNumbers: after.randomNumbers
            }
        }
        const diff: Diff = {}
        if (!arraysEqual(before.previewQueue, after.previewQueue)) {
            diff.previewQueue = after.previewQueue
        }
        let activePieceDiff = ActivePiece.diff(before.activePiece, after.activePiece)
        if (activePieceDiff) {
            diff.activePiece = activePieceDiff
        }
        let playfieldDiff = Playfield.diff(before.playfield, after.playfield)
        if (playfieldDiff) {
            diff.playfield = playfieldDiff
        }
        if (!LockdownStatus.equal(before.lockdownStatus, after.lockdownStatus)) {
            diff.lockdownStatus = after.lockdownStatus
        }
        if (before.holdEnabled != after.holdEnabled) {
            diff.holdEnabled = after.holdEnabled
        }
        if (before.holdPiece != after.holdPiece) {
            diff.holdPiece = after.holdPiece
        }
        if (before.status != after.status) {
            diff.status = after.status
        }
        if (!arraysEqual(before.activeInputs, after.activeInputs, Input.ActiveGame.equal)) {
            diff.activeInputs = after.activeInputs
        }
        if (!PendingMovement.equal(before.pendingMovement, after.pendingMovement)) {
            diff.pendingMovement = after.pendingMovement
        }
        if (before.dasCharged[ShiftDirection.Left] != after.dasCharged[ShiftDirection.Left]
            || before.dasCharged[ShiftDirection.Right] != after.dasCharged[ShiftDirection.Right]) {
            diff.dasCharged = after.dasCharged
        }
        if (before.shiftDirection != after.shiftDirection) {
            diff.shiftDirection = after.shiftDirection
        }
        if (!arraysEqual(before.randomNumbers, after.randomNumbers)) {
            diff.randomNumbers = after.randomNumbers
        }

        let returnValue = Object.keys(diff).length > 0 ? diff : null
        return returnValue satisfies Diff
    }

}

export default CoreState