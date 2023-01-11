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
            pieces: [1, 2, 3, 5, 6, 7],
            states: {
                [Orientation.North]: { pureRotationIndex: 0 },
                [Orientation.East]: { pureRotationIndex: 1 },
                [Orientation.South]: { pureRotationIndex: 2 },
                [Orientation.West]: { pureRotationIndex: 3 }
            }
        }
    ],
    kickTables: [
        {
            pieces: [2, 3, 5, 6, 7],
            tables: {
                [Orientation.North]: {
                    [Orientation.East]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
                    [Orientation.South]: [[0, 0], [0, -1]],
                    [Orientation.West]: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
                },
                [Orientation.East]: {
                    [Orientation.North]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
                    [Orientation.South]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
                    [Orientation.West]: [[0, 0], [1, 0]]
                },
                [Orientation.South]: {
                    [Orientation.North]: [[0, 0], [0, 1]],
                    [Orientation.East]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
                    [Orientation.West]: [[0, 0], [-1, 0], [1, -1], [0, 2], [1, 2]]
                },
                [Orientation.West]: {
                    [Orientation.North]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
                    [Orientation.East]: [[0, 0], [-1, 0]],
                    [Orientation.South]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
                }
            }
        },
        {
            pieces: [1],
            tables: {
                [Orientation.North]: {
                    [Orientation.East]: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
                    [Orientation.South]: [[0, 0], [0, -1]],
                    [Orientation.West]: [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
                },
                [Orientation.East]: {
                    [Orientation.North]: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
                    [Orientation.South]: [[0, 0], [-1, 0], [2, 0], [1, -2], [-2, 1]],
                    [Orientation.West]: [[0, 0], [1, 0]]
                },
                [Orientation.South]: {
                    [Orientation.North]: [[0, 0], [0, 1]],
                    [Orientation.East]: [[0, 0], [1, 0], [-2, 0], [-1, 2], [2, -1]],
                    [Orientation.West]: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]]
                },
                [Orientation.West]: {
                    [Orientation.North]: [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
                    [Orientation.East]: [[0, 0], [-1, 0]],
                    [Orientation.South]: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]
                }
            }
        }
    ]
}

export default system;