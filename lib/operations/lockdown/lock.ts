import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import Grid from "../../definitions/Grid";
import ActivePiece from "../../definitions/ActivePiece";
import GameOverCondition from "../../definitions/GameOverCondition";
import GameStatus from "../../definitions/GameStatus";
import Cell from "../../definitions/Cell";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { operations }) => {
        let linesToClear = getLinesToClear(state.activePiece, state.playfieldGrid);
        return Operation.Sequence(
            recordLockEvent(linesToClear),
            operations.clearLines(linesToClear),
            enableHold,
            nextProvider
        )
    })
)

let recordLockEvent = (linesToClear: number[]) => Operation.Draft(({ state, events }) => { 
    events.push(GameEvent.Lock(state.activePiece, linesToClear, state.playfieldGrid)) 
})

let nextProvider = Operation.Provide(({ state }, { operations, schema }) => {
    let { settings, activePiece } = state;
    if (activePiece.coordinates.every(c => c.y < schema.playfield.ceiling)) {
        return gameOverClearActivePiece;
    } else {
        return operations.next;
    }
})

let enableHold = Operation.Draft(({ state }) => { state.holdEnabled = true })

let getLinesToClear = (activePiece: ActivePiece, playfieldGrid: Grid<Cell>): number[] => {
    return activePiece.coordinates.reduce((accum, c) => {
        if (!accum.includes(c.y)) {
            let rowFull = playfieldGrid[c.y].every(block => block.classifier != Cell.Classifier.Empty);
            if (rowFull) {
                return [...accum, c.y];
            }
        }
        return accum;
    }, [] as number[]);
}   

let gameOverClearActivePiece = Operation.Draft(({ state }) => {
    state.status = GameStatus.GameOver(GameOverCondition.Lockout)

    // TODO: Does this do anything? This used to come after the reset of activePiece, when ghostCoordinate is []
    state.activePiece.ghostCoordinates.forEach(c => {
        let cell = state.playfieldGrid[c.y][c.x];
        if (cell.classifier == Cell.Classifier.Mino && cell.ghost) {
            state.playfieldGrid[c.y][c.x] = Cell.Empty;
        }
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
