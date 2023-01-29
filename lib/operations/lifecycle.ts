import type { Provider, Operation } from "../definitions/operationalDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { Rotation } from "../definitions/rotationDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { Input } from "../definitions/inputDefinitions";
import { Init as InitPlayfield } from "./playfield";
import { draftInstructionsOnStart, addInput, removeInput, init as metaInit } from "./meta";
import { initSettings } from "./settings";
import { Init as PreviewInit, Next } from "./preview";
import { init as holdInit, Hold } from "./hold";
import { StartShiftLeftInput, StartShiftRightInput, EndShiftRightInput, EndShiftLeftInput } from "./shift";
import { CancelSoftDrop, StartSoftDrop, hardDrop } from "./drop";
import { Rotate } from "./rotation";

/**
 * Core providers which are expected to be executed outside of other providers (for example
 * starting and stopping the game and handling user input)
 * Like Composite Providers, they use multiple state-specific providers and/or drafters
 */
namespace LifecycleProviders {

    export namespace Makers {

        export let init = (settings: Settings) => [
            metaInit,
            initSettings(settings),
            PreviewInit.provider,
            InitPlayfield.provider,
            holdInit
        ]

        export function startInput(input: Input.ActiveGame): Provider {
            return {
                provide: ({ meta }: State) => {
                    if (meta.activeInputs.includes(input)) {
                        return [];
                    }
                    return [
                        addInput(input),
                        performInputAction(input)
                    ];
                }
            }
        }

        function performInputAction(input: Input.ActiveGame): Provider {
            return {
                provide: () => {
                    switch (input) {
                        case Input.ActiveGame.ShiftLeft:
                            return StartShiftLeftInput.provider;
                        case Input.ActiveGame.ShiftRight:
                            return StartShiftRightInput.provider;
                        case Input.ActiveGame.SD:
                            return StartSoftDrop.provider;
                        case Input.ActiveGame.HD:
                            return hardDrop;
                        case Input.ActiveGame.Hold:
                            return Hold.provider;
                        case Input.ActiveGame.RotateCW:
                            return Rotate.provider(Rotation.CW);
                        case Input.ActiveGame.RotateCCW:
                            return Rotate.provider(Rotation.CCW);
                        case Input.ActiveGame.Rotate180:
                            return Rotate.provider(Rotation.Degrees180);
                        default:
                            return { provide: () => [] } // Do nothing
                    }
                }
            }
        }

    }

    export namespace EndInput {

        let provideInputEndAction = (input: Input.ActiveGame): Provider => {
            return {
                requiresActiveGame: true,
                provide: () => {
                    switch(input) {
                        case Input.ActiveGame.ShiftRight:
                            return EndShiftRightInput.provider;
                        case Input.ActiveGame.ShiftLeft:
                            return EndShiftLeftInput.provider;
                        case Input.ActiveGame.SD:
                            return CancelSoftDrop.provider;
                        default:
                            return [];
                    }
                }
            }
        }

        /**
         * Called when a user input ends. Usually this would be the release of a keypress
         */
        export function provider(input: Input.ActiveGame): Provider {
            return {
                provide: () =>  [ 
                    removeInput(input),
                    provideInputEndAction(input)
                ]
            }
        }

    }

    export let start: Operation[] = [
        Next.provider,
        ...draftInstructionsOnStart
    ]
    
}

export default LifecycleProviders;