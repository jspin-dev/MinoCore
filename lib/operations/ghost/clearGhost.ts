import Operation from "../../definitions/Operation";

export default Operation.Draft(draft => {
    let { activePiece, grid } = draft.playfield;
    activePiece.ghostCoordinates.forEach(c => {
        if (grid[c.y][c.x] < 0) {
            grid[c.y][c.x] = 0;
        }
    });
    activePiece.ghostCoordinates = [];
}, {     
    description: "Clearing ghost",
    strict: true
}) 