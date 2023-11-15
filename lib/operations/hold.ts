import { Settings } from "../definitions/settingsDefinitions";

import { PreviewGridSettings, copyPreviewGridSettings } from "./previewGrid";
import { spawn } from "./spawn";
import { Next } from "./preview";
import { clearActivePiece } from "./activePiece";
import { Operation } from "../definitions/operationalDefinitions";
import { Grid } from "../definitions/shared/Grid";

namespace PerformHoldChange {

    let setGrid = (grid: Grid) => Operation.Draft(draft => { draft.hold.grid = grid })

    let createHoldGrid = (pieceId: number, settings: Settings): Grid => {
        let grid = copyPreviewGridSettings(settings)[pieceId];
        let bufferSpace = new Array(grid[0].length).fill(0);
        return [
            ...grid,
            bufferSpace,
        ];
    }
    
    let syncGrid = Operation.Provide(({ hold, settings }) =>{
        let grid = createHoldGrid(hold.pieceId || 0, settings);
        return setGrid(grid);
    })
    
    export let provider = (operation: Operation.Any) => Operation.Sequence(
        PreviewGridSettings.validate,
        operation,
        syncGrid
    )        

}

export let init = PerformHoldChange.provider(
    Operation.Draft(draft => {
        draft.hold = { 
            enabled: true, 
            grid: [], 
            pieceId: null 
        };
    })
)

export namespace Hold {

    let draftHold = PerformHoldChange.provider(
        Operation.DraftStrict(draft => {
            Object.assign(draft.hold, {
                pieceId: draft.playfield.activePiece.id,
                enabled: false
            });
        })
    )

    /**
     * Note: Unlike most cases, here we are intentionally referncing the 
     * original hold state rather than using the provider's state
     */
    let next = (previousHoldPieceId: number) => previousHoldPieceId > 0 ? spawn(previousHoldPieceId) : Next.provider

    export let provider = Operation.Provide(({ hold }) => {
        if (hold.enabled) {
            return Operation.Sequence(
                draftHold,
                clearActivePiece(true),
                next(hold.pieceId)
            )
        } else {
            return Operation.None;
        }
    })

}