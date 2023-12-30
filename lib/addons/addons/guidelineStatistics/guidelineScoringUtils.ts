import ActivePiece from "../../../definitions/ActivePiece"
import Cell from "../../../definitions/Cell"
import Grid from "../../../definitions/Grid"
import TetroPiece from "../../../presets/tetro/TetroPiece"
import LockScoreAction from "../../definitions/LockScoreAction"
import Playfield from "../../../definitions/Playfield"

export let detectPC = (playfield: Playfield): boolean => {
    return playfield.every(row => row.every(cell => Cell.isEmpty(cell)))
}

export let detectTspin = (
    activePiece: ActivePiece, 
    previousGrid: Readonly<Grid<Cell>>
): LockScoreAction.Type | null => {
    if (activePiece.id != TetroPiece.T) {
        return null
    }
    let x = activePiece.location.x
    let y = activePiece.location.y
    let corners = [
        previousGrid[y] == undefined || !Cell.isEmpty(previousGrid[y][x]),
        previousGrid[y] == undefined || !Cell.isEmpty(previousGrid[y][x + 2]),
        previousGrid[y + 2] == undefined || !Cell.isEmpty(previousGrid[y + 2][x]), 
        previousGrid[y + 2] == undefined || !Cell.isEmpty(previousGrid[y + 2][x + 2])
    ]
    let occupiedCornerCount = corners.reduce((sum, cornerOccupied) => cornerOccupied ? sum + 1 : sum, 0)
    // T-spin detected, still need to specify the type of t-spin
    if (occupiedCornerCount > 2) { 
        let orientation = activePiece.orientation;
        let tSpinFull = (orientation == 0 && corners[0] && corners[1]) ||
                (orientation == 1 && corners[1] && corners[3]) ||
                (orientation == 2 && corners[2] && corners[3]) ||
                (orientation == 3 && corners[0] && corners[2]);
        return tSpinFull ? LockScoreAction.Type.TSpin : LockScoreAction.Type.TSpinMini
    }
    return null
}
