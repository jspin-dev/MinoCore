import Cell from "../definitions/Cell";
import Operation from "../definitions/CoreOperation";
import GameEvent from "../definitions/GameEvent";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }) => {
        /**
         * Note: Unlike most cases, here we are intentionally referncing the 
         * original hold state rather than using the provider's state
         */
        let replaceActivePiece = Operation.Provide((_, { operations }) => {
            return state.holdPieceId ? operations.spawn(state.holdPieceId) : operations.next;
        })
        
        let operations = Operation.Sequence(holdActivePiece, clearActivePiece, replaceActivePiece);
        return operations.applyIf(state.holdEnabled);
    })
)

let holdActivePiece = Operation.Draft(({ state, events }) => {
    let previousHoldPiece = state.holdPieceId;
    let holdPiece = state.activePiece.id;
    state.holdPieceId = holdPiece;
    state.holdEnabled = false;
    events.push(GameEvent.Hold(previousHoldPiece, holdPiece));
})


let clearActivePiece = Operation.Draft(({ state }) => {
    // TODO: Does this do anything? This used to come after the reset of activePiece, when ghostCoordinate is []
    state.activePiece.ghostCoordinates.forEach(c => {
        let cell = state.playfieldGrid[c.y][c.x]
        if (cell.classifier == Cell.Classifier.Mino && cell.ghost) {
            state.playfieldGrid[c.y][c.x] = Cell.Empty;
        }
    });
    state.activePiece.coordinates.forEach(c => {
        state.playfieldGrid[c.y][c.x] = Cell.Empty;
    });
    state.activePiece = {
        id: null,
        location: null,
        coordinates: [],
        ghostCoordinates: [],
        orientation: null,
        activeRotation: false
    };
})