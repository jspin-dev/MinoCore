import Cell from "../../../definitions/Cell"
import Operation from "../../definitions/CoreOperation"
import CorePreconditions from "../../utils/CorePreconditions"

let draftGhostClear = Operation.Draft(({ state }) => {
    if (state.activePiece.ghostCoordinates.length > 0) {
        state.activePiece.ghostCoordinates.forEach(c => { state.playfield[c.y][c.x] = Cell.Empty })
        state.activePiece.ghostCoordinates = []
    }
})

let rootOperation = Operation.Resolve(({ state }) => {
    let { settings, activePiece, playfield } = state
    if (!settings.ghostEnabled) {
        return draftGhostClear
    }
    let newGhostCoordinates = activePiece.coordinates
        .map(c => { return { x: c.x, y: c.y + activePiece.availableDropDistance } })
        .filter(c => {
            let cell = playfield[c.y][c.x]
            return Cell.isEmpty(cell) || Cell.isGhost(cell)
        });

    return Operation.Draft(({ state }) => {
        let { activePiece, playfield } = state
        activePiece.ghostCoordinates.forEach(c => {
            if (Cell.isGhost(state.playfield[c.y][c.x])) {
                state.playfield[c.y][c.x] = Cell.Empty;
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
    rootOperation: rootOperation
})
