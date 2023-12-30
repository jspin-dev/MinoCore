import type PendingMovement from "./PendingMovement"
import type Input from "../../definitions/Input"
import type Settings from "./Settings"
import ActivePiece from "../../definitions/ActivePiece"
import GameStatus from "./GameStatus"
import ShiftDirection from "../../definitions/ShiftDirection"
import type PieceIdentifier from "../../definitions/PieceIdentifier"
import type Playfield from "../../definitions/Playfield"
import LockdownStatus from "./LockdownStatus"

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
    dasCharged: {
        [ShiftDirection.Left]: boolean,
        [ShiftDirection.Right]: boolean
    },
    shiftDirection: ShiftDirection,
    randomNumbers: number[]
}

namespace CoreState {

    export let initial: CoreState = {
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

export default CoreState