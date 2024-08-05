import RotationSystemBasis from "../../schema/rotation/definitions/RotationSystem"
import CoreState from "../../core/definitions/CoreState"
import Coordinate from "../../definitions/Coordinate"
import Orientation from "../../definitions/Orientation"
import Cell from "../../definitions/Cell"
import GameSchema from "../../schema/definitions/GameSchema"
import { willCollide } from "../../util/stateUtils"

export const centralColumnValidator = {
    isValidRotation: function (
        { activePiece, playfield }: CoreState,
        coordinates: readonly Coordinate[],
        offset: RotationSystemBasis.Offset,
        gameSchema: GameSchema
    ) {
        if (willCollide(playfield, coordinates, offset[0], offset[1])) {
            return false
        }
        const pieceSize = gameSchema.rotationSystem.pieces[activePiece.id].grids[Orientation.North].length
        const location = activePiece.location
        const referenceGrid = playfield
            .slice(location.y, location.y + pieceSize)
            .map(row => row.slice(location.x, location.x + pieceSize))

        const initialResult: boolean = undefined
        const result = referenceGrid.reduce((accum, row, i) => {
            if (accum != undefined) { return accum }
            let index = row.findIndex((_, j) => {
                return Cell.isLocked(playfield[i + location.y][j + location.x])
            })
            return index > -1 ? (index != 1) : undefined
        }, initialResult)
        return result !== false
    }
} satisfies RotationSystemBasis.Validator