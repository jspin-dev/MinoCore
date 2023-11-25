import Operation from "../../definitions/Operation";
import { Coordinate } from "../../definitions/playfieldDefinitions";
import { findHardDropDistance } from "../../util/stateUtils";
import clearGhost from "./clearGhost";

export default Operation.Provide(({ settings, playfield }) => {
    if (!settings.ghostEnabled) {
        return playfield.activePiece.ghostCoordinates.length > 0 ? clearGhost : Operation.None
    }
    let dy = findHardDropDistance(playfield, settings);

    let activePieceCoordinates = playfield.activePiece.coordinates;
    let ghostCoordinates = activePieceCoordinates
        .map(c => { return { x: c.x, y: c.y + dy } })
        .filter(c => !activePieceCoordinates.some(coord => coord.x === c.x && coord.y === c.y));

    return setGhost(ghostCoordinates);
}, {
    description: "Refreshing ghost piece placement so that it is in sync with the active piece",
    strict: true
})

let setGhost = (coordinates: Coordinate[]) => Operation.DraftStrict(draft => {
    let { activePiece, grid } = draft.playfield;
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
    console.log(coordinates)
    coordinates.forEach(c => {
        if (grid[c.y][c.x] <= 0) {
            grid[c.y][c.x] = -activePiece.id
        }
    });
})
