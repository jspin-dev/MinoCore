import ActivePiece from "../../definitions/ActivePiece"
import Cell from "../../definitions/Cell"
import Grid from "../../definitions/Grid"
import TetroPiece from "../../presets/tetro/TetroPiece"
import LockScoreAction from "../definitions/LockScoreAction"
import Playfield from "../../definitions/Playfield"

export const detectPC = (playfield: Playfield) => {
    return playfield.every(row => row.every(cell => Cell.isEmpty(cell)))
}

export const detectTspin = (
    activePiece: ActivePiece, 
    previousGrid: Readonly<Grid<Cell>>
) => {
    if (activePiece.id != TetroPiece.T) {
        return null
    }
    const x = activePiece.location.x
    const y = activePiece.location.y
    const corners = [
        previousGrid[y] == undefined || !Cell.isEmpty(previousGrid[y][x]),
        previousGrid[y] == undefined || !Cell.isEmpty(previousGrid[y][x + 2]),
        previousGrid[y + 2] == undefined || !Cell.isEmpty(previousGrid[y + 2][x]), 
        previousGrid[y + 2] == undefined || !Cell.isEmpty(previousGrid[y + 2][x + 2])
    ]
    const occupiedCornerCount = corners.reduce((sum, cornerOccupied) => cornerOccupied ? sum + 1 : sum, 0)
    // T-spin detected, still need to specify the type of t-spin
    if (occupiedCornerCount > 2) {
        const orientation = activePiece.orientation;
        const tSpinFull = (orientation == 0 && corners[0] && corners[1]) ||
                (orientation == 1 && corners[1] && corners[3]) ||
                (orientation == 2 && corners[2] && corners[3]) ||
                (orientation == 3 && corners[0] && corners[2]);
        return tSpinFull ? LockScoreAction.Type.TSpin : LockScoreAction.Type.TSpinMini
    }
    return null
}
