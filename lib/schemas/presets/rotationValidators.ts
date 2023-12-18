import Cell from "../../coreOperations/definitions/Cell";
import Coordinate from "../../definitions/Coordinate";
import CoreState from "../../coreOperations/definitions/CoreState";
import GameSchema from "../definitions/GameSchema";
import KickTableSchema from "../definitions/KickTableSchema";
import Orientation from "../../definitions/Orientation";
import RotationSystem from "../definitions/RotationSystem";
import { willCollide } from "../../util/stateUtils";

namespace RotationValidatorPresets {

    export let simpleCollision: KickTableSchema.RotationValidator = {
        isValid: (
            state: CoreState,
            schema: GameSchema,
            coordinates: Readonly<Coordinate[]>, 
            offset: RotationSystem.Offset
        ): boolean => {
           return !willCollide(state.playfieldGrid, schema.playfield, coordinates, offset[0], offset[1]);
        }
    }

    export let centerColumn: KickTableSchema.RotationValidator = {
        isValid: function (
            state: CoreState,
            schema: GameSchema,
            coordinates: readonly Coordinate[], 
            offset: RotationSystem.Offset
        ): boolean {
            let { activePiece, playfieldGrid } = state;
            if (willCollide(playfieldGrid, schema.playfield, coordinates, offset[0], offset[1])) {
                return false;
            }
    
            let pieceSize = state.generatedRotationGrids[activePiece.id][Orientation.North].length;
            let location = activePiece.location;
            let referenceGrid = playfieldGrid
                .slice(location.y, location.y + pieceSize)
                .map(row => row.slice(location.x, location.x + pieceSize))
    
            let result = referenceGrid.reduce((accum, row, i) => {
                if (accum != null) { return accum }
                let index = row.findIndex((_, j) => {
                    return Cell.isLocked(playfieldGrid[i + location.y][j + location.x]);
                })
                console.log(index)
                return index > -1 ? (index != 1) : null
            }, null as boolean);
            return result !== false;
        }
    }    

}

export default RotationValidatorPresets;