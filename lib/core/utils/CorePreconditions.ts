import GameStatus from "../definitions/GameStatus"
import CorePrecondition from "../definitions/CorePrecondition"

namespace CorePreconditions {

    const defaultOpName = "[anonymous]"

    export const activeGame: CorePrecondition = {
        isValid: result => { return result.state.status == GameStatus.Active },
        rationale: opName => `Operation ${opName ?? defaultOpName} is only applicable when the game is active`
    }

    export const activePiece: CorePrecondition = {
        isValid: result => { return result.state.activePiece != null },
        rationale: opName => {
            return `Operation ${opName ?? defaultOpName} is only applicable when an active piece is on the playfield`
        }
    }

}

export default CorePreconditions