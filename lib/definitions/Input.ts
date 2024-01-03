import ShiftDirection from "./ShiftDirection"
import Rotation from "./Rotation"

type Input = Input.Types.ActiveGame | Input.Types.Lifecycle

// Active game inputs
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

        export let Shift = (direction: ShiftDirection): Types.Shift => {
            return { classifier: Classifier.Shift, direction }
        }

        export let Rotate = (rotation: Rotation): Types.Rotate => {
            return { classifier: Classifier.Rotate, rotation }
        }

        export let HD: Types.HD = { classifier: Classifier.HD }

        export let SD: Types.SD = { classifier: Classifier.SD }

        export let Hold: Types.Hold = { classifier: Classifier.Hold }

        export let equal = (input1: ActiveGame, input2: ActiveGame): boolean => {
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

    export enum Lifecycle {
        Pause,
        Restart
    }

    export enum Classifier {
        ActiveGame,
        Lifecycle
    }

    export namespace Types {

        export interface ActiveGame {
            classifier: Classifier.ActiveGame
            input: Input.ActiveGame
        }

        export interface Lifecycle {
            classifier: Classifier.Lifecycle
            input: Input.Lifecycle
        }

    }

}

// Convenience
namespace Input {

    let activeGame = (input: ActiveGame): Types.ActiveGame => {
        return { classifier: Classifier.ActiveGame, input }
    }

    let lifecycle = (input: Lifecycle): Types.Lifecycle => {
        return { classifier: Classifier.Lifecycle, input }
    }

    export let ShiftLeft = activeGame(Input.ActiveGame.Shift(ShiftDirection.Left))
    export let ShiftRight = activeGame(Input.ActiveGame.Shift(ShiftDirection.Right))
    export let RotateCCW = activeGame(Input.ActiveGame.Rotate(Rotation.CCW))
    export let RotateCW = activeGame(Input.ActiveGame.Rotate(Rotation.CW))

    export let Rotate180 = activeGame(Input.ActiveGame.Rotate(Rotation.Degrees180))

    export let HD = activeGame(Input.ActiveGame.HD)

    export let SD = activeGame(Input.ActiveGame.SD)

    export let Hold = activeGame(Input.ActiveGame.Hold)

    export let Pause = lifecycle(Input.Lifecycle.Pause)

    export let Restart = lifecycle(Input.Lifecycle.Restart)

}

export default Input