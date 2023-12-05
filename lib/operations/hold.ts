import { Settings } from "../definitions/settingsDefinitions";
import Operation from "../definitions/CoreOperation";
import { Grid } from "../definitions/shared/Grid";
import { copyPreviewGridSettings } from "../util/stateUtils";
import GameEvent from "../definitions/GameEvent";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { operations }) => {
        if (state.hold.enabled) {
            return Operation.Sequence(
                operations.validatePreviewGrids,
                holdActivePiece,
                syncGrid,
                clearActivePiece,
                /**
                 * Note: Unlike most cases, here we are intentionally referncing the 
                 * original hold state rather than using the provider's state
                 */
                replaceActivePiece(state.hold.pieceId)
            )
        } else {
            return Operation.None;
        }
    })
)

let holdActivePiece = Operation.Draft(({ state, events }) => {
    let previousHoldPiece = state.hold.pieceId;
    let holdPiece = state.playfield.activePiece.id;
    state.hold.pieceId = holdPiece;
    state.hold.enabled = false;
    events.push(GameEvent.Hold(previousHoldPiece, holdPiece));
})

let createHoldGrid = (pieceId: number, settings: Settings): Grid => {
    let grid = copyPreviewGridSettings(settings)[pieceId];
    let bufferSpace = new Array(grid[0].length).fill(0);
    return [...grid, bufferSpace];
}

let syncGrid = Operation.Provide(({ state }) =>{
    let grid = createHoldGrid(state.hold.pieceId || 0, state.settings);
    return Operation.Draft(({ state }) => { state.hold.grid = grid })
})

let replaceActivePiece = (previousHoldPiece: number) => Operation.Provide((_, { operations }) => {
    return previousHoldPiece > 0 ? operations.spawn(previousHoldPiece) : operations.next;
})

let clearActivePiece = Operation.Draft(({ state }) => {
    let playfield = state.playfield;
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