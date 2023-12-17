import Coordinate from "../../definitions/Coordinate"
import CoreState from "../../definitions/CoreState"
import GameSchema from "../../definitions/GameSchema"
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
            state: CoreState,
            schema: GameSchema,
            coordinates: Readonly<Coordinate[]>, 
            offset: GameSchema.Offset
        ): boolean => {
           return !willCollide(state.playfieldGrid, schema.playfield, coordinates, offset[0], offset[1]);
        }
    }
    
    export let playfield: GameSchema.PlayfieldSpec = { columns: 10, rows: 40, ceiling: 20 }

    export let spawnOrientation: Orientation = Orientation.North;

    export let kickTable: GameSchema.KickTable = {
        [Orientation.North]: {
            [Orientation.North]: [],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: [[0, 0]]
        },
        [Orientation.East]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: [[0, 0]]
        },
        [Orientation.South]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [],
            [Orientation.West]: [[0, 0]]
        },
        [Orientation.West]: {
            [Orientation.North]: [[0, 0]],
            [Orientation.East]: [[0, 0]],
            [Orientation.South]: [[0, 0]],
            [Orientation.West]: []
        }
    }

}

export default SchemaDefaults;
