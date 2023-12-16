import Cell from "../../definitions/Cell";
import Coordinate from "../../definitions/Coordinate";
import Operation from "../../definitions/CoreOperation";
import { findInstantDropDistance } from "../../util/stateUtils";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { operations, schema }) => {
        let { settings, activePiece, playfieldGrid } = state;
        if (!settings.ghostEnabled) {
            return activePiece.ghostCoordinates.length > 0 ? operations.clearGhost : Operation.None
        }
        let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
        let dy = findInstantDropDistance(collisionPrereqisites);
        let activePieceCoordinates = activePiece.coordinates;
        let ghostCoordinates = activePieceCoordinates
            .map(c => { return { x: c.x, y: c.y + dy } })
            .filter(c => !activePieceCoordinates.some(coord => coord.x === c.x && coord.y === c.y));
    
        return setGhost(ghostCoordinates);
    })  
)

let setGhost = (coordinates: Coordinate[]) => Operation.Draft(({ state }) => {
    let { activePiece, playfieldGrid } = state;
    activePiece.ghostCoordinates.forEach(c => {
        let cell = state.playfieldGrid[c.y][c.x]
        if (cell.classifier == Cell.Classifier.Mino && cell.ghost) {
            state.playfieldGrid[c.y][c.x] = Cell.Empty;
        }
    });
    activePiece.ghostCoordinates = coordinates;
    /**
     * Ghost coordinates will only be represented on the grid if there is no
     * active piece coordinate already in that cell.
     */
    coordinates.forEach(c => {
        if (playfieldGrid[c.y][c.x].classifier != Cell.Classifier.Mino) {
            playfieldGrid[c.y][c.x] = Cell.Mino(activePiece.id, true);
        }
    });
})