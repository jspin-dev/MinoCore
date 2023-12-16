import ActivePiece from "../../definitions/ActivePiece"
import Cell from "../../definitions/Cell"
import Coordinate from "../../definitions/Coordinate"
import GameSchema from "../../definitions/GameSchema"
import Grid from "../../definitions/Grid"
import Orientation from "../../definitions/Orientation"
import { willCollide } from "../../util/stateUtils"

namespace SchemaDefaults {

    export let offsets: GameSchema.PureOrientationOffsets = {
        [Orientation.North]: [0, 0],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [0, 0]
    }
    
    export let rotationValidator : GameSchema.RotationValidator = {
        isValid: (
            activePiece: ActivePiece,
            playfieldGrid: Grid<Cell>,
            playfieldSpec: GameSchema.PlayfieldSpec,
            coordinates: Readonly<Coordinate[]>, 
            offset: GameSchema.Offset
        ): boolean => {
           return !willCollide({ activePiece, playfieldGrid, playfieldSpec }, coordinates, offset[0], offset[1])
        }
    }
    
    export let playfield: GameSchema.PlayfieldSpec = { columns: 10, rows: 40, ceiling: 20 }

    export let spawnOrientation: Orientation = Orientation.North;

    export let kickTable: GameSchema.KickTable = {
        [Orientation.North]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: [[0, 0]]
        },
        [Orientation.East]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: [[0, 0]]
        },
        [Orientation.South]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: [[0, 0]]
        },
        [Orientation.West]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: [[0, 0]]
        }
    }

}

export default SchemaDefaults;
