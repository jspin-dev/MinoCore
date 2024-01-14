import CoreOperationResult from "../definitions/CoreOperationResult"
import GameStatus from "../definitions/GameStatus"
import CoreState from "../definitions/CoreState"
import Operation from "../../definitions/Operation"

export type CorePrecondition = Operation.Precondition<CoreOperationResult<CoreState>>

namespace CorePreconditions {

    export const activeGame: CorePrecondition = {
        isValid: result => { return result.state.status == GameStatus.Active },
        rationale: "This operation is only applicable when the game is active"
    }

    export const activePiece: CorePrecondition = {
        isValid: result => { return result.state.activePiece != null },
        rationale: "This operation is only applicable when an active piece is on the playfield"
    }

}

export default CorePreconditions