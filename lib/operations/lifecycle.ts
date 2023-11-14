import { Rotation } from "../definitions/rotationDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { Input } from "../definitions/inputDefinitions";
import { Init as InitPlayfield } from "./playfield";
import { draftInstructionsOnStart, addInput, removeInput, init as metaInit } from "./meta";
import { initSettings } from "./settings";
import { Init as PreviewInit, Next } from "./preview";
import { init as holdInit, Hold } from "./hold";
import { StartShiftLeftInput, StartShiftRightInput, EndShiftRightInput, EndShiftLeftInput } from "./shift";
import { cancelSoftDrop, StartSoftDrop, hardDrop } from "./drop";
import { rotate } from "./rotation";
import { updateStatsOnInput } from "./statistics";
import { State } from "../types/stateTypes";

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
            holdInit,
            initStats
        ]

        let initStats: Drafter = {
            draft: draft => {
                draft.statistics = {
                    level: 1,
                    lines: 0,
                    keysPressed: 0,
                    piecesLocked: 0,
                    time: 0,
                    kpp: 0,
                    pps: 0,
                    steps: {
                        drop: 0,
                        rotate: 0,
                        shift: 0,
                        hold: 0
                    },
                    finesse: 0,
                    scoreState: {
                        lastLockScoreAction: null,
                        score: 0,
                        combo: -1
                    },
                    actionTally: {}
                }
            }
        }

        export function startInput(input: Input.ActiveGame): Provider {
            return {
                provide: ({ meta }: State) => {
                    if (meta.activeInputs.includes(input)) {
                        return [];
                    }
                    return [
                        addInput(input),
                        performInputAction(input),
                        updateStatsOnInput
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
                            return rotate(Rotation.CW);
                        case Input.ActiveGame.RotateCCW:
                            return rotate(Rotation.CCW);
                        case Input.ActiveGame.Rotate180:
                            return rotate(Rotation.Degrees180);
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
                            return cancelSoftDrop;
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