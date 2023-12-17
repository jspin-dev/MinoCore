import Cell from "../definitions/Cell";
import Coordinate from "../definitions/Coordinate";
import CoreState from "../definitions/CoreState";
import GameSchema from "../definitions/GameSchema"
import Orientation from "../definitions/Orientation";
import TetroPiece from "../definitions/TetroPiece";
import { willCollide } from "../util/stateUtils";
import schemaDefaults from "./common/schemaTetroDefaults";
import shapes from "./common/tetroShapes";

let arsCenterColumnValidator: GameSchema.RotationValidator = {
    isValid: function (
        state: CoreState,
        schema: GameSchema,
        coordinates: readonly Coordinate[], 
        offset: GameSchema.Offset
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

let defaultKickOffsets: GameSchema.Offset[] = [[0, 0], [1, 0], [-1, 0]]
let defaultKickTable: GameSchema.KickTable = {
    [Orientation.North]: {
        [Orientation.North]: [],
        [Orientation.East]: defaultKickOffsets,
        [Orientation.South]: defaultKickOffsets,
        [Orientation.West]: defaultKickOffsets
    },
    [Orientation.East]: {
        [Orientation.North]: defaultKickOffsets,
        [Orientation.East]: [],
        [Orientation.South]: defaultKickOffsets,
        [Orientation.West]: defaultKickOffsets
    },
    [Orientation.South]: {
        [Orientation.North]: defaultKickOffsets,
        [Orientation.East]: defaultKickOffsets,
        [Orientation.South]: [],
        [Orientation.West]: defaultKickOffsets
    },
    [Orientation.West]: {
        [Orientation.North]: defaultKickOffsets,
        [Orientation.East]: defaultKickOffsets,
        [Orientation.South]: defaultKickOffsets,
        [Orientation.West]: []
    }
}

let defaults: GameSchema.PieceDefinition.Defaults = {
    startLocation: { x: 3, y: 19 },
    spawnOrientation: Orientation.South,
    offsets: schemaDefaults.offsets,
    rotationValidator: schemaDefaults.rotationValidator,
    kickTable: defaultKickTable
}

namespace DefinitionSpecs {

    export let jPiece: GameSchema.PieceDefinition.Buildable = { 
        id: TetroPiece.J, 
        shape: shapes[TetroPiece.J],
        rotationValidator: arsCenterColumnValidator, 
        spawnOrientation: Orientation.South,
        offsets: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        } 
    }

    export let lPiece: GameSchema.PieceDefinition.Buildable = {
        id: TetroPiece.L,
        shape: shapes[TetroPiece.L],
        rotationValidator: arsCenterColumnValidator,
        spawnOrientation: Orientation.South
    }

    export let iPiece: GameSchema.PieceDefinition.Buildable = { 
        id: TetroPiece.I, 
        shape: shapes[TetroPiece.I] ,
        kickTable: schemaDefaults.kickTable,
        offsets: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        }
    }


    export let sPiece: GameSchema.PieceDefinition.Buildable = { 
        id: TetroPiece.S, 
        shape: shapes[TetroPiece.S],
        offsets: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [-1, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        }
    }

    export let zPiece: GameSchema.PieceDefinition.Buildable = { 
        id: TetroPiece.Z, 
        shape: shapes[TetroPiece.Z],
        offsets: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [1, 0]
        } 
    }

    export let oPiece: GameSchema.PieceDefinition.Buildable = { 
        id: TetroPiece.O,
        shape: shapes[TetroPiece.O],
        kickTable: schemaDefaults.kickTable,
        startLocation: { x: 4, y: 20 }
    }

    export let tPiece: GameSchema.PieceDefinition.Buildable = { 
        id: TetroPiece.T, 
        shape: shapes[TetroPiece.T],
        rotationValidator: arsCenterColumnValidator,
        spawnOrientation: Orientation.South
    }

}

let schema: GameSchema = {
    playfield: schemaDefaults.playfield,
    pieces: { 
        [TetroPiece.J]: GameSchema.PieceDefinition.build(DefinitionSpecs.jPiece, defaults),
        [TetroPiece.L]: GameSchema.PieceDefinition.build(DefinitionSpecs.lPiece, defaults),
        [TetroPiece.S]: GameSchema.PieceDefinition.build(DefinitionSpecs.sPiece, defaults),
        [TetroPiece.Z]: GameSchema.PieceDefinition.build(DefinitionSpecs.zPiece, defaults),
        [TetroPiece.T]: GameSchema.PieceDefinition.build(DefinitionSpecs.tPiece, defaults),
        [TetroPiece.I]: GameSchema.PieceDefinition.build(DefinitionSpecs.iPiece, defaults),
        [TetroPiece.O]: GameSchema.PieceDefinition.build(DefinitionSpecs.oPiece, defaults)
    }
}

export default schema;