import { Orientation, RotationSystem } from "../definitions/rotationDefinitions";
import shapes from "./tetraShapes.json";

let system: RotationSystem = {
    startLocations: [
        {
            pieces: [1, 2, 3, 5, 6, 7],
            location: { x: 3, y: 18 }
        },
        {
            pieces: [4],
            location: { x: 4, y: 18 }
        }
    ],
    shapes,
    rotationStateInfo: [
        {
            pieces: [1],
            states: {
                [Orientation.North]: { pureRotationIndex: 0 },
                [Orientation.East]: { pureRotationIndex: 1 },
                [Orientation.South]: { pureRotationIndex: 0 },
                [Orientation.West]: { pureRotationIndex: 1 }
            }
        },
        {
            pieces: [2, 3, 6],
            states: {
                [Orientation.North]: { pureRotationIndex: 2 },
                [Orientation.East]: { pureRotationIndex: 3 },
                [Orientation.South]: { pureRotationIndex: 0, offset: [0, 1] },
                [Orientation.West]: { pureRotationIndex: 1 }
            }
        },
        {
            pieces: [5, 7],
            states: {
                [Orientation.North]: { pureRotationIndex: 2 },
                [Orientation.East]: { pureRotationIndex: 3 },
                [Orientation.South]: { pureRotationIndex: 2 },
                [Orientation.West]: { pureRotationIndex: 3 }
            }
        }
    ],
    kickTables: []
}

export default system;