import type { Drafter, DraftState, } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import type { RotationGridSet } from "../definitions/rotationDefinitions";

namespace SettingsDrafters {

    export namespace Makers {

        export let init = (settings: Settings): Drafter => {

            return {
                draft: (draft: DraftState) => { 
                    draft.settings = settings
                }
            }
        }

        export let setPreviewGrids = (grids: Grid[]): Drafter => {
            return {
                draft: draft => {
                    draft.settings.rotationSystem[0].previewGrids = grids;
                }
            }
        }

        export let setRotationGrids = (grids: RotationGridSet[]): Drafter => {
            return {
                draft: draft => {
                    draft.settings.rotationSystem[0].rotationGrids = grids;
                }
            }
        }

        export let setDAS = (das: number): Drafter => {
            return {
                draft: draft => {
                    draft.settings.das = das;
                }
            }
        }

        export let setARR = (arr: number): Drafter => {
            return {
                draft: draft => {
                    draft.settings.arr = arr;
                }
            }
        }

        export let setSDF = (softDropInterval: number): Drafter => {
            return {
                draft: draft => {
                    draft.settings.softDropInterval = softDropInterval;
                }
            }
        }


    }

}

export default SettingsDrafters;