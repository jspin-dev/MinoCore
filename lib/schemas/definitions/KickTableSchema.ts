import Coordinate from "../../definitions/Coordinate"
import CoreState from "../../coreOperations/definitions/CoreState"
import GameSchema from "./GameSchema"
import Orientation from "../../definitions/Orientation"
import PieceIdentifier from "../../definitions/PieceIdentifier"
import RotationSystem from "./RotationSystem"

interface KickTableSchema {
    rotationValidator: KickTableSchema.RotationValidator
    tables: { [id: PieceIdentifier]: KickTableSchema.Table }
}

namespace KickTableSchema {

    export interface Table { 
        [Orientation.North]: Table.SubTable,
        [Orientation.East]: Table.SubTable,
        [Orientation.South]: Table.SubTable,
        [Orientation.West]: Table.SubTable 
    }

    export namespace Table {

        export interface SubTable {
            [Orientation.North]: RotationSystem.Offset[]
            [Orientation.East]: RotationSystem.Offset[]
            [Orientation.South]: RotationSystem.Offset[]
            [Orientation.West]: RotationSystem.Offset[]
        }
    
    }

    export interface RotationValidator {
        isValid: (
            state: CoreState,
            gameSchema: GameSchema,
            coordinates: readonly Coordinate[], 
            offset: RotationSystem.Offset
        ) => boolean
    }

}

export default KickTableSchema