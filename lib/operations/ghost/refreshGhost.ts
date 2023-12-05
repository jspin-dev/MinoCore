import Operation from "../../definitions/CoreOperation";
import { Coordinate } from "../../definitions/playfieldDefinitions";
import { findInstantDropDistance } from "../../util/stateUtils";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { operations }) => {
        let { settings, playfield } = state;
        if (!settings.ghostEnabled) {
            return playfield.activePiece.ghostCoordinates.length > 0 ? operations.clearGhost : Operation.None
        }
        let dy = findInstantDropDistance(state);
        let activePieceCoordinates = playfield.activePiece.coordinates;
        let ghostCoordinates = activePieceCoordinates
            .map(c => { return { x: c.x, y: c.y + dy } })
            .filter(c => !activePieceCoordinates.some(coord => coord.x === c.x && coord.y === c.y));
    
        return setGhost(ghostCoordinates);
    })  
)

let setGhost = (coordinates: Coordinate[]) => Operation.Draft(({ state }) => {
    let { activePiece, grid } = state.playfield;
    activePiece.ghostCoordinates.forEach(c => {
        if (grid[c.y][c.x] < 0) {
            grid[c.y][c.x] = 0;
        }
    });
    activePiece.ghostCoordinates = coordinates;
    /**
     * Ghost coordinates will only be represented on the grid if there is no
     * active piece coordinate already in that cell.
     */
    coordinates.forEach(c => {
        if (grid[c.y][c.x] <= 0) {
            grid[c.y][c.x] = -activePiece.id
        }
    });
})