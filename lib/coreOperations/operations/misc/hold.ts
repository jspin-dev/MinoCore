import Cell from "../../definitions/Cell";
import Operation from "../../definitions/CoreOperation";
import GameEvent from "../../definitions/GameEvent";

export default Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }) => {
        /**
         * Note: Unlike most cases, here we are intentionally referncing the 
         * original hold state rather than using the resolver's state
         */
        let resolveNextOp = Operation.Resolve((_, { operations }) => {
            return state.holdPieceId ? operations.spawn(state.holdPieceId) : operations.next;
        })
        
        let operations = Operation.Sequence(draftHold, draftActivePiece, resolveNextOp);
        return operations.applyIf(state.holdEnabled);
    })
)

let draftHold = Operation.Draft(({ state, events }) => {
    let previousHoldPiece = state.holdPieceId;
    let holdPiece = state.activePiece.id;
    state.holdPieceId = holdPiece;
    state.holdEnabled = false;
    events.push(GameEvent.Hold(previousHoldPiece, holdPiece));
})


let draftActivePiece = Operation.Draft(({ state }) => {
    [...state.activePiece.ghostCoordinates, ... state.activePiece.coordinates].forEach(c => {
        state.playfieldGrid[c.y][c.x] = Cell.Empty;
    })
    state.activePiece = null;
})