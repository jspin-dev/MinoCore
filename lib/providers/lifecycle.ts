import type { Provider, Operation } from "../definitions/operationalDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { Rotation } from "../definitions/rotationDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { Input } from "../definitions/inputDefinitions";

import { init as initPlayfield } from "./playfield";
import { draftInstructionsOnStart } from "./meta";
import MetaDrafters from "../drafters/metaDrafters";
import SettingsDrafters from "../drafters/settingsDrafters";
import { init as previewInit, Next } from "./preview";
import { init as holdInit } from "./hold";
import {  StartShiftLeftInput, StartShiftRightInput, EndShiftRightInput, EndShiftLeftInput } from "./shift";
import { CancelSoftDrop, StartSoftDrop, hardDrop } from "./drop";
import { Rotate } from "./rotation";
import { hold } from "./hold";

/**
 * Core providers which are expected to be executed outside of other providers (for example
 * starting and stopping the game and handling user input)
 * Like Composite Providers, they use multiple state-specific providers and/or drafters
 */
namespace LifecycleProviders {

    export namespace Makers {

        export let init = (settings: Settings) => [
            MetaDrafters.init,
            SettingsDrafters.Makers.init(settings),
            previewInit,
            initPlayfield,
            ...holdInit
        ]

        export function startInput(input: Input.ActiveGame): Provider {
            return {
                provide: ({ meta }: State) => {
                    if (meta.activeInputs.includes(input)) {
                        return [];
                    }
                    return [
                        MetaDrafters.Makers.addInput(input),
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
                            return hold;
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
                    MetaDrafters.Makers.removeInput(input),
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