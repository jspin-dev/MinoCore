import { Orientation } from "../definitions/rotationDefinitions";
import { Step } from "../types/steps";
import { Piece } from "./tetraPieces";

export type FinesseSettings = {
    pieces: Piece[],
    info: {
        orientations: Orientation[],
        steps: Step[][]
    }[]
}[]

let finesseSettings: FinesseSettings = [
    {
        pieces: [Piece.J, Piece.L, Piece.T],
        info: [
            {
                orientations: [Orientation.North],
                steps: [
                    [Step.DasLeft],
                    [Step.TapLeft, Step.TapLeft],
                    [Step.TapLeft],
                    [],
                    [Step.TapRight],
                    [Step.TapRight, Step.TapRight],
                    [Step.DasRight, Step.TapLeft],
                    [Step.DasRight]
                ]
            },
            {
                orientations: [Orientation.South],
                steps: [
                    [Step.DasLeft, Step.RotateCW, Step.RotateCW],
                    [Step.TapLeft, Step.TapLeft, Step.RotateCW, Step.RotateCW],
                    [Step.TapLeft, Step.RotateCW, Step.RotateCW],
                    [Step.RotateCW, Step.RotateCW],
                    [Step.TapRight, Step.RotateCW, Step.RotateCW],
                    [Step.TapRight, Step.TapRight, Step.RotateCW, Step.RotateCW],
                    [Step.DasRight, Step.TapLeft, Step.RotateCW, Step.RotateCW],
                    [Step.DasRight, Step.RotateCW, Step.RotateCW]
                ]
            },
            {
                orientations: [Orientation.East],
                steps: [
                    [Step.RotateCW, Step.DasLeft],
                    [Step.DasLeft, Step.RotateCW],
                    [Step.RotateCW, Step.TapLeft, Step.TapLeft],
                    [Step.RotateCW, Step.TapLeft],
                    [Step.RotateCW],
                    [Step.RotateCW, Step.TapRight],
                    [Step.RotateCW, Step.TapRight, Step.TapRight],
                    [Step.RotateCW, Step.DasRight, Step.TapLeft],
                    [Step.DasRight, Step.RotateCW]
                ]
            },
            {
                orientations: [Orientation.West],
                steps: [
                    [Step.RotateCCW, Step.DasLeft],
                    [Step.RotateCCW, Step.TapLeft, Step.TapLeft],
                    [Step.RotateCCW, Step.TapLeft],
                    [Step.RotateCCW],
                    [Step.RotateCCW, Step.TapRight],
                    [Step.RotateCCW, Step.TapRight, Step.TapRight],
                    [Step.DasRight, Step.TapLeft, Step.RotateCCW],
                    [Step.DasRight, Step.RotateCCW],
                    [Step.RotateCCW, Step.DasRight]
                ]
            }
        ]
    },
    {
        pieces: [Piece.O],
        info: [ 
            {
                orientations: [Orientation.North, Orientation.South, Orientation.East, Orientation.West],
                steps: [
                    [Step.DasLeft],
                    [Step.DasLeft, Step.TapRight],
                    [Step.TapLeft, Step.TapLeft],
                    [Step.TapLeft],
                    [],
                    [Step.TapRight],
                    [Step.TapRight, Step.TapRight],
                    [Step.DasRight, Step.TapLeft],
                    [Step.DasRight]
                ]
            }
        ],
    },
    {
        pieces: [Piece.S, Piece.Z],
        info: [
            {
                orientations: [Orientation.North, Orientation.South],
                steps: [
                    [Step.DasLeft],
                    [Step.TapLeft, Step.TapLeft],
                    [Step.TapLeft],
                    [],
                    [Step.TapRight],
                    [Step.TapRight, Step.TapRight],
                    [Step.DasRight, Step.TapLeft],
                    [Step.DasRight]
                ]
            },
            {
                orientations: [Orientation.East, Orientation.West],
                steps: [
                    [Step.RotateCCW, Step.DasLeft],
                    [Step.DasLeft, Step.RotateCW],
                    [Step.RotateCCW, Step.TapLeft],
                    [Step.RotateCCW],
                    [Step.RotateCW],
                    [Step.RotateCW, Step.TapRight],
                    [Step.RotateCW, Step.TapRight, Step.TapRight],
                    [Step.DasRight, Step.RotateCCW],
                    [Step.RotateCW, Step.DasRight]
                ]
            }
        ]
        
    },
    {
        pieces: [Piece.I],
        info: [
            {
                orientations: [Orientation.North, Orientation.South],
                steps:[
                    [Step.DasLeft],
                    [Step.TapLeft, Step.TapLeft],
                    [Step.TapLeft],
                    [],
                    [Step.TapRight],
                    [Step.TapRight, Step.TapRight],
                    [Step.DasRight]
                ]
            },
            {
                orientations: [Orientation.East, Orientation.West],
                steps: [
                    [Step.RotateCW, Step.RotateCW, Step.DasLeft],
                    [Step.DasLeft, Step.RotateCCW],
                    [Step.DasLeft, Step.RotateCW],
                    [Step.TapLeft, Step.RotateCCW],
                    [Step.RotateCCW],
                    [Step.RotateCW],
                    [Step.TapRight, Step.RotateCW],
                    [Step.DasRight, Step.RotateCCW],
                    [Step.DasRight, Step.RotateCW],
                    [Step.RotateCW, Step.DasRight]
                ]
            }
        ]
    }
]

export default finesseSettings;