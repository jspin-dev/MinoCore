import { Settings } from "../definitions/settingsDefinitions";

import { spawn } from "./spawn";
import Operation from "../definitions/Operation";
import { Grid } from "../definitions/shared/Grid";
import { copyPreviewGridSettings } from "../util/stateUtils";
import validatePreviewGrids from "./next/validatePreviewGrids";
import next from "./next/next";

export default Operation.Provide(({ hold }) => {
    if (hold.enabled) {
        return Operation.Sequence(
            validatePreviewGrids,
            holdActivePiece,
            syncGrid,
            clearActivePiece,
            /**
             * Note: Unlike most cases, here we are intentionally referncing the 
             * original hold state rather than using the provider's state
             */
            replaceActivePiece(hold.pieceId)
        )
    } else {
        return Operation.None;
    }
})

let holdActivePiece = Operation.DraftStrict(draft => {
    Object.assign(draft.hold, {
        pieceId: draft.playfield.activePiece.id,
        enabled: false
    });
})

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
    return Operation.Draft(draft => { draft.hold.grid = grid })
})

let replaceActivePiece = (previousHoldPieceId: number) => previousHoldPieceId > 0 ? spawn(previousHoldPieceId) : next

let clearActivePiece = Operation.DraftStrict(draft => {
    let playfield = draft.playfield;
    // TODO: Does this do anything? This used to come after the reset of activePiece, when ghostCoordinate is []
    playfield.activePiece.ghostCoordinates.forEach(c => {
        if (playfield.grid[c.y][c.x] < 0) {
            playfield.grid[c.y][c.x] = 0;
        }
    });
    playfield.activePiece.coordinates.forEach(c => {
        playfield.grid[c.y][c.x] = 0;
    });
    playfield.activePiece = {
        id: null,
        location: null,
        coordinates: [],
        ghostCoordinates: [],
        orientation: null,
        activeRotation: false
    };
})