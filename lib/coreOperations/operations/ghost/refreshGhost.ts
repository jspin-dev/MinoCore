import Cell from "../../../definitions/Cell";
import Operation from "../../definitions/CoreOperation";

export default Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }, { operations }) => {
        let { settings, activePiece, playfieldGrid } = state;
        if (!settings.ghostEnabled) {
            return activePiece.ghostCoordinates.length > 0 ? operations.clearGhost : Operation.None
        }
        let newGhostCoordinates = activePiece.coordinates
            .map(c => { return { x: c.x, y: c.y + activePiece.availableDropDistance } })
            .filter(c => {
                let cell = playfieldGrid[c.y][c.x];
                return Cell.isEmpty(cell) || Cell.isGhost(cell);
            });
    
        return Operation.Draft(({ state }) => {
            let { activePiece, playfieldGrid } = state;
            activePiece.ghostCoordinates.forEach(c => {
                if (Cell.isGhost(state.playfieldGrid[c.y][c.x])) {
                    state.playfieldGrid[c.y][c.x] = Cell.Empty;
                }
            });
            activePiece.ghostCoordinates = newGhostCoordinates;
            activePiece.ghostCoordinates.forEach(c => {
                playfieldGrid[c.y][c.x] = Cell.Ghost(activePiece.id);
            })
        })
    })  
)

