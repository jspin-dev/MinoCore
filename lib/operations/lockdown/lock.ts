import Operation from "../../definitions/Operation";
import { GameOverCondition, GameStatus } from "../../definitions/metaDefinitions";
import { Playfield } from "../../definitions/stateTypes";
import recordLock from "../statistics/recordLock";

export default Operation.ProvideStrict(({ state }, { operations }) => {
    let linesToClear = getLinesToClear(state.playfield);
    let previousGrid = state.playfield.spinSnapshot ? state.playfield.spinSnapshot.map(row => [...row]) : null;
    return Operation.Sequence(
        operations.clearLines(linesToClear),
        recordLock(linesToClear.length, previousGrid),
        enableHold,
        nextProvider
    )
})

let nextProvider = Operation.Provide(({ state }, { operations }) => {
    let { playfield, settings } = state;
    if (playfield.activePiece.coordinates.every(c => c.y < settings.ceilingRow)) {
        return gameOverClearActivePiece;
    } else {
        return operations.next;
    }
})

let enableHold = Operation.Draft(({ state }) => { state.hold.enabled = true })

let getLinesToClear = (playfield: Playfield): number[] => {
    let { activePiece, grid } = playfield;
    return activePiece.coordinates.reduce((accum, c) => {
        if (!accum.includes(c.y)) {
            let rowFull = grid[c.y].every(block => block > 0);
            if (rowFull) {
                return [...accum, c.y];
            }
        }
        return accum;
    }, [] as number[]);
}   

let gameOverClearActivePiece = Operation.DraftStrict(({ state }) => {
    state.meta.status = GameStatus.GameOver(GameOverCondition.Lockout)

    let playfield = state.playfield;
    // TODO: Does this do anything? This used to come after the reset of activePiece, when ghostCoordinate is []
    playfield.activePiece.ghostCoordinates.forEach(c => {
        if (playfield.grid[c.y][c.x] < 0) {
            playfield.grid[c.y][c.x] = 0;
        }
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
