import Operation from "../../definitions/CoreOperation";

export default Operation.Util.requireActiveGame(
    Operation.Draft(({ state }) => {
        let { activePiece, grid } = state.playfield;
        activePiece.ghostCoordinates.forEach(c => {
            if (grid[c.y][c.x] < 0) {
                grid[c.y][c.x] = 0;
            }
        });
        activePiece.ghostCoordinates = [];
    })
)