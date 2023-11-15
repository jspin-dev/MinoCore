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
import { State } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";

/**
 * Core providers which are expected to be executed outside of other providers (for example
 * starting and stopping the game and handling user input)
 * Like Composite Providers, they use multiple state-specific providers and/or drafters
 */
namespace LifecycleProviders {

    export namespace Makers {

        export let init = (settings: Settings) => Operation.Sequence(
            metaInit,
            initSettings(settings),
            PreviewInit.provider,
            InitPlayfield.provider,
            holdInit,
            initStats
        )

        let initStats = Operation.Draft(draft => {
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
        })

        export let startInput = (input: Input.ActiveGame) => Operation.Provide(({ meta }) => {
            if (meta.activeInputs.includes(input)) {
                return Operation.None;
            }
            return Operation.Sequence(
                addInput(input),
                performInputAction(input),
                updateStatsOnInput
            );
        })

        export let performInputAction = (input: Input.ActiveGame): Operation.Any => {
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
                    return Operation.None // Do nothing
            }
        }

    }

    export namespace EndInput {

        let provideInputEndAction = (input: Input.ActiveGame): Operation.Any => {
            switch(input) {
                case Input.ActiveGame.ShiftRight:
                    return EndShiftRightInput.provider;
                case Input.ActiveGame.ShiftLeft:
                    return EndShiftLeftInput.provider;
                case Input.ActiveGame.SD:
                    return cancelSoftDrop;
                default:
                    return Operation.None;
            }
        }

        /**
         * Called when a user input ends. Usually this would be the release of a keypress
         */
        export let provider = (input: Input.ActiveGame) => Operation.Sequence( 
            removeInput(input),
            provideInputEndAction(input)
        )

    }

    export let start = Operation.Sequence(Next.provider, draftInstructionsOnStart)

}

export default LifecycleProviders;