import Cell from "../../definitions/Cell";
import Operation from "../../definitions/CoreOperation";

export default Operation.Util.requireActiveGame(
    Operation.Draft(({ state }) => {
        state.activePiece.ghostCoordinates.forEach(c => { state.playfieldGrid[c.y][c.x] = Cell.Empty });
        state.activePiece.ghostCoordinates = [];
    })
)