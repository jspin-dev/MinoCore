import type { Drafter } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";

namespace HoldDrafters {

    export let init: Drafter = {
        draft: draft => {
            draft.hold = { 
                enabled: true, 
                grid: [], 
                pieceId: null 
            };
        }
    }

    export let hold: Drafter = {
        requiresActiveGame: true,
        draft: draft => {
            Object.assign(draft.hold, {
                pieceId: draft.playfield.activePiece.id,
                enabled: false
            });
        }
    }

    export let enable: Drafter = {
        draft: draft => { draft.hold.enabled = true }
    }

    export namespace Makers {


        export let setGrid = (grid: Grid): Drafter => {
            return {
                draft: draft => { draft.hold.grid = grid }
            } 
        }
    
    }
    
}

export default HoldDrafters;