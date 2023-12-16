import Cell from "../../definitions/Cell";
import Operation from "../../definitions/CoreOperation";

export default Operation.Util.requireActiveGame(
    Operation.Draft(({ state }) => {
        console.log("clear ghost?")
        state.activePiece.ghostCoordinates.forEach(c => {
            let cell = state.playfieldGrid[c.y][c.x]
            if (cell.classifier == Cell.Classifier.Mino && cell.ghost) {
                state.playfieldGrid[c.y][c.x] = Cell.Empty;
            }
        });
        state.activePiece.ghostCoordinates = [];
    })
)