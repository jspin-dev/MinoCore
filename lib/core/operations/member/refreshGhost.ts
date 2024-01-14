import Cell from "../../../definitions/Cell"
import Operation from "../../definitions/CoreOperation"
import CorePreconditions from "../../utils/CorePreconditions"

const rootOperation = Operation.Resolve((result, { schema }) => {
    const newGhostCoordinates = schema.ghostProvider.calculateCoordinates(result)
    return Operation.Draft(({ state }) => {
        let { activePiece, playfield } = state
        activePiece.ghostCoordinates.forEach(c => {
            if (Cell.isGhost(state.playfield[c.y][c.x])) {
                state.playfield[c.y][c.x] = Cell.Empty
            }
        })
        activePiece.ghostCoordinates = newGhostCoordinates
        activePiece.ghostCoordinates.forEach(c => {
            playfield[c.y][c.x] = Cell.Ghost(activePiece.id)
        })
    })
})

export default Operation.Export({
    operationName: "refreshGhost",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation
})
