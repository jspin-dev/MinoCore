import type {  Provider, Operation, Drafter, Actionable } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { Settings } from "../definitions/settingsDefinitions";

import { PreviewGridSettings, copyPreviewGridSettings } from "./previewGrid";
import { spawn } from "./spawn";
import { Next } from "./preview";
import { clearActivePiece } from "./activePiece";

namespace PerformHoldChange {

    let setGrid = (grid: Grid): Drafter => {
        return {
            draft: draft => { draft.hold.grid = grid }
        } 
    }

    let createHoldGrid = (pieceId: number, settings: Settings): Grid => {
        let grid = copyPreviewGridSettings(settings)[pieceId];
        let bufferSpace = new Array(grid[0].length).fill(0);
        return [
            ...grid,
            bufferSpace,
        ];
    }
    
    let syncGrid: Provider = {
        provide: ({ hold, settings }: State) =>{
            let grid = createHoldGrid(hold.pieceId || 0, settings);
            return setGrid(grid);
        }    
    }
    
    export let provider = (drafter: Drafter): Provider => {
        return {
            provide: () => [
                PreviewGridSettings.validate,
                drafter,
                syncGrid
            ]        
        }
    }

}

export let init = PerformHoldChange.provider({
    draft: draft => {
        draft.hold = { 
            enabled: true, 
            grid: [], 
            pieceId: null 
        };
    }
})

export namespace Hold {

    let draftHold = PerformHoldChange.provider({
        requiresActiveGame: true,
        draft: draft => {
            Object.assign(draft.hold, {
                pieceId: draft.playfield.activePiece.id,
                enabled: false
            });
        }
    });

    /**
     * Note: Unlike most cases, here we are intentionally referncing the 
     * original hold state rather than using the provider's state
     */
    let next = (previousHoldPieceId: number): Provider => {
        return previousHoldPieceId > 0 ? spawn(previousHoldPieceId) : Next.provider
    }

    export let provider = {
        requiresActiveGame: true,
        provide: ({ hold }: State): Actionable => {
            if (!hold.enabled) {
                return [];
            }
            return [
                draftHold,
                clearActivePiece(true),
                next(hold.pieceId) 
            ]
        }
    }

}