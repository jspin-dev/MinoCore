import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import Grid from "../../../definitions/Grid";
import ActivePiece from "../../../definitions/ActivePiece";
import GameOverCondition from "../../definitions/GameOverCondition";
import GameStatus from "../../definitions/GameStatus";
import Cell from "../../../definitions/Cell";

export default Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }, { operations }) => {
        let linesToClear = getLinesToClear(state.activePiece, state.playfieldGrid);
        return Operation.Sequence(resolveLock(linesToClear), operations.clearLines(linesToClear), resolveNextPiece);
    })
)

let resolveNextPiece = Operation.Resolve(({ state }, { operations, schema }) => {
    let gameOver = state.activePiece.coordinates.every(c => c.y < schema.playfield.ceiling);
    let draftLockoutStatus = Operation.Draft(({ state }) => {
        state.status = GameStatus.GameOver(GameOverCondition.Lockout);
    });
    let resolveActivePieceReset = Operation.Draft(({ state }) => { state.activePiece = null });
    return Operation.Sequence(resolveActivePieceReset, gameOver ? draftLockoutStatus : operations.next);
})

let resolveLock = (linesToClear: number[]) => Operation.Draft(({ state, events }) => {
    events.push(GameEvent.Lock(state.activePiece, linesToClear, state.playfieldGrid));
    state.activePiece.ghostCoordinates.forEach(c => state.playfieldGrid[c.y][c.x] = Cell.Empty);
    state.activePiece.coordinates.forEach(c => { state.playfieldGrid[c.y][c.x] = Cell.Locked(state.activePiece.id) });
    state.holdEnabled = true;
})

let getLinesToClear = (activePiece: ActivePiece, playfieldGrid: Grid<Cell>): number[] => {
    return activePiece.coordinates.reduce((accum, c) => {
        if (!accum.includes(c.y)) {
            if (playfieldGrid[c.y].every(cell => !Cell.isEmpty(cell))) {
                return [...accum, c.y];
            }
        }
        return accum;
    }, [] as number[]);
}  