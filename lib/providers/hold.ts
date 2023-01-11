import type {  Provider, Operation, Drafter, Actionable } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { Settings } from "../definitions/settingsDefinitions";

import HoldDrafters from "../drafters/holdDrafters";
import { PreviewGridSettings, copyPreviewGridSettings } from "./previewGrid";
import { Spawn } from "./playfield";
import { Next } from "./preview";
import PlayfieldDrafters from "../drafters/playfieldDrafters";

let syncGrid: Provider = {
    provide: ({ hold, settings }: State) =>{
        let grid = createHoldGrid(hold.pieceId || 0, settings);
        return HoldDrafters.Makers.setGrid(grid);
    }    
}

let performHoldChange = (drafter: Drafter) => [
    PreviewGridSettings.validate,
    drafter,
    syncGrid
]

let createHoldGrid = (pieceId: number, settings: Settings): Grid => {
    let grid = copyPreviewGridSettings(settings)[pieceId];
    let bufferSpace = new Array(grid[0].length).fill(0);
    return [
        ...grid,
        bufferSpace,
    ];
}

/**
 * Note: Unlike most cases, here we are intentionally referncing the 
 * original hold state rather than using the provider's state
 */
let nextPieceProviderMaker = (previousHoldPieceId: number): Provider => {
    return previousHoldPieceId > 0 ? Spawn.spawn(previousHoldPieceId) : Next.provider
}

export let init: Operation[] = performHoldChange(HoldDrafters.init)

export let hold = {
    requiresActiveGame: true,
    provide: ({ hold }: State): Actionable => {
        if (!hold.enabled) {
            return [];
        }
        return [
            ...performHoldChange(HoldDrafters.hold),
            PlayfieldDrafters.Makers.clearActivePiece(true),
            nextPieceProviderMaker(hold.pieceId) 
        ]
    }
}
