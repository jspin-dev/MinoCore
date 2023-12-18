import ActivePiece from "../../../coreOperations/definitions/ActivePiece";
import Cell from "../../../coreOperations/definitions/Cell";
import Grid from "../../../definitions/Grid";
import TetroPiece from "../../../schemas/definitions/TetroPiece";
import LockScoreAction from "../../definitions/LockScoreAction";

export let detectPC = (playfieldGrid: Grid<Cell>): boolean => {
    return playfieldGrid.every(row => row.every(cell => Cell.isEmpty(cell)));
}

export let detectTspin = (
    activePiece: ActivePiece, 
    previousGrid: Readonly<Grid<Cell>>
): LockScoreAction.Type => {
    if (activePiece.id != TetroPiece.T) {
        return null;
    }
    let x = activePiece.location.x;
    let y = activePiece.location.y;
    let corners = [
        previousGrid[y] == undefined || !Cell.isEmpty(previousGrid[y][x]),
        previousGrid[y] == undefined || !Cell.isEmpty(previousGrid[y][x + 2]),
        previousGrid[y + 2] == undefined || !Cell.isEmpty(previousGrid[y + 2][x]), 
        previousGrid[y + 2] == undefined || !Cell.isEmpty(previousGrid[y + 2][x + 2])
    ]
    let occupiedCornerCount = corners.reduce((sum, cornerOccupied) => cornerOccupied ? sum + 1 : sum, 0);
    // T-spin detected, still need to specify the type of t-spin
    if (occupiedCornerCount > 2) { 
        let orientation = activePiece.orientation;
        let tSpinFull = (orientation == 0 && corners[0] && corners[1]) ||
                (orientation == 1 && corners[1] && corners[3]) ||
                (orientation == 2 && corners[2] && corners[3]) ||
                (orientation == 3 && corners[0] && corners[2]);
        return tSpinFull ? LockScoreAction.Type.TSpin : LockScoreAction.Type.TSpinMini;
    }
    return null;
}
