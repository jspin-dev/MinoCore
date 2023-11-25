import Operation from "../../definitions/Operation";
import { GameOverCondition, GameStatus } from "../../definitions/metaDefinitions";
import { Playfield } from "../../definitions/stateTypes";
import clearLines from "../clearLines";
import updateStatus from "../lifecycle/updateStatus";
import next from "../next/next";
import recordLock from "../statistics/recordLock";

export default Operation.ProvideStrict(({ playfield }) => {
    let linesToClear = getLinesToClear(playfield);
    let previousGrid = playfield.spinSnapshot ? playfield.spinSnapshot.map(row => [...row]) : null;
    return Operation.Sequence(
        clearLines(linesToClear),
        recordLock(linesToClear.length, previousGrid),
        enableHold,
        nextProvider
    )
})

let nextProvider = Operation.Provide(({ playfield, settings }) => {
    if (playfield.activePiece.coordinates.every(c => c.y < settings.ceilingRow)) {
        return Operation.Sequence(
            updateStatus(GameStatus.GameOver(GameOverCondition.Lockout)),
            clearActivePiece
        )
    } else {
        return next
    }
})

let enableHold = Operation.Draft(draft => { draft.hold.enabled = true })

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

let clearActivePiece = Operation.DraftStrict(draft => {
    let playfield = draft.playfield;
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
