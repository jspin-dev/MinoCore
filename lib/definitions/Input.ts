import ShiftDirection from "./ShiftDirection"
import Rotation from "./Rotation"

type Input = Input.Types.ActiveGame | Input.Types.Pause | Input.Types.Restart

// Active games inputs
namespace Input {

    export type ActiveGame = ActiveGame.Types.Shift | ActiveGame.Types.Rotate | ActiveGame.Types.HD
        | ActiveGame.Types.SD | ActiveGame.Types.Hold

    export namespace ActiveGame {

        export enum Classifier {
            Shift = 0,
            Rotate = 1,
            HD = 2,
            SD = 3,
            Hold = 4
        }

        export namespace Types {

            export interface Shift {
                classifier: Classifier.Shift,
                direction: ShiftDirection
            }

            export interface Rotate {
                classifier: Classifier.Rotate,
                rotation: Rotation
            }

            export interface HD {
                classifier: Classifier.HD
            }

            export interface SD {
                classifier: Classifier.SD
            }

            export interface Hold {
                classifier: Classifier.Hold
            }

        }

    }

    // Convenience
    export namespace ActiveGame {

        export const Shift = (direction: ShiftDirection) => {
            return { classifier: Classifier.Shift, direction } satisfies Types.Shift
        }

        export const Rotate = (rotation: Rotation) => {
            return { classifier: Classifier.Rotate, rotation } satisfies Types.Rotate
        }

        export const HD = { classifier: Classifier.HD } satisfies Types.HD

        export const SD = { classifier: Classifier.SD } satisfies Types.SD

        export const Hold = { classifier: Classifier.Hold } satisfies Types.Hold

        export const equal = (input1: ActiveGame, input2: ActiveGame) => {
            switch (input1.classifier) {
                case Classifier.Shift:
                    return input2.classifier == ActiveGame.Classifier.Shift && input2.direction == input1.direction
                case Classifier.Rotate:
                    return input2.classifier == ActiveGame.Classifier.Rotate && input2.rotation == input1.rotation
                case Classifier.HD:
                case Classifier.SD:
                case Classifier.Hold:
                    return input1.classifier == input2.classifier
            }
        }

    }

}

namespace Input {

    export enum Classifier {
        ActiveGame,
        Pause,
        Restart
    }

    export namespace Types {

        export interface ActiveGame {
            classifier: Classifier.ActiveGame
            input: Input.ActiveGame
        }

        export interface Pause {
            classifier: Classifier.Pause
        }

        export interface Restart {
            classifier: Classifier.Restart
        }

    }

}

// Convenience
namespace Input {

    const activeGame = (input: ActiveGame) => {
        return { classifier: Classifier.ActiveGame, input } satisfies Types.ActiveGame
    }

    export const ShiftLeft = activeGame(Input.ActiveGame.Shift(ShiftDirection.Left))
    export const ShiftRight = activeGame(Input.ActiveGame.Shift(ShiftDirection.Right))
    export const RotateCCW = activeGame(Input.ActiveGame.Rotate(Rotation.CCW))
    export const RotateCW = activeGame(Input.ActiveGame.Rotate(Rotation.CW))

    export const Rotate180 = activeGame(Input.ActiveGame.Rotate(Rotation.Degrees180))

    export const HD = activeGame(Input.ActiveGame.HD)

    export const SD = activeGame(Input.ActiveGame.SD)

    export const Hold = activeGame(Input.ActiveGame.Hold)

    export const Pause: Input = { classifier: Classifier.Pause }

    export const Restart: Input = { classifier: Classifier.Restart }

}

export default Input