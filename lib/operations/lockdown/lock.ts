import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import { GameOverCondition, GameStatus } from "../../definitions/metaDefinitions";
import { Playfield } from "../../definitions/stateTypes";

export default Operation.requireActiveGame(
    Operation.Provide(({ state }, { operations }) => {
        let linesToClear = getLinesToClear(state.playfield);
        return Operation.Sequence(
            recordLockEvent(linesToClear),
            operations.clearLines(linesToClear),
            enableHold,
            nextProvider
        )
    })
)

let recordLockEvent = (linesToClear: number[]) => Operation.Draft(({ state, events }) => { 
    events.push(GameEvent.Lock(state.playfield.activePiece, linesToClear, state.playfield.grid)) 
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

let gameOverClearActivePiece = Operation.Draft(({ state }) => {
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
