import Cell from "../../definitions/Cell"
import Coordinate from "../../definitions/Coordinate"
import Orientation from "../../definitions/Orientation"
import RotationSystem from "../definitions/RotationSystem"
import { willCollide } from "../../util/stateUtils"

namespace RotationValidatorPresets {

    export let simpleCollision: RotationSystem.Validator = {
        isValid: (
            { playfield }: RotationSystem.StateReference,
            coordinates: Readonly<Coordinate[]>, 
            offset: RotationSystem.Offset
        ): boolean => {
           return !willCollide(playfield, coordinates, offset[0], offset[1])
        }
    }

    export let centerColumn: RotationSystem.Validator = {
        isValid: function (
            { activePiece, playfield, generatedGrids }: RotationSystem.StateReference,
            coordinates: readonly Coordinate[], 
            offset: RotationSystem.Offset
        ): boolean {
            if (willCollide(playfield, coordinates, offset[0], offset[1])) {
                return false;
            }
            let pieceSize = generatedGrids[activePiece.id][Orientation.North].length
            let location = activePiece.location
            let referenceGrid = playfield
                .slice(location.y, location.y + pieceSize)
                .map(row => row.slice(location.x, location.x + pieceSize))
    
            let result = referenceGrid.reduce((accum, row, i) => {
                if (accum != null) { return accum }
                let index = row.findIndex((_, j) => {
                    return Cell.isLocked(playfield[i + location.y][j + location.x])
                })
                console.log(index)
                return index > -1 ? (index != 1) : null
            }, null as boolean)
            return result !== false
        }
    }    

}

export default RotationValidatorPresets