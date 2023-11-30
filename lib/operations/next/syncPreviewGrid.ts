import Operation from "../../definitions/Operation";
import { Settings } from "../../definitions/settingsDefinitions";
import { Grid } from "../../definitions/shared/Grid";
import { State } from "../../definitions/stateTypes";
import { copyPreviewGridSettings } from "../../util/stateUtils";

export default Operation.Provide(({ state }) => {
    let grid = generatePreviewGrid(state.preview.queue, state.settings);
    return Operation.Draft(({ state }) => { state.preview.grid = grid });    
}, {
    description: "Syncing preview grid with the piece ids in the queue"
})

let generatePreviewGrid = (queue: readonly number[], settings: Settings): Grid => {
    let previewGridSettings = copyPreviewGridSettings(settings);

    let adjustedQueue = [ ...queue ];
    let delta = settings.nextPreviewSize - queue.length;
    if (delta > 0) {
        adjustedQueue = queue.concat(new Array(delta).fill(0));
    } else if (delta < 0) {
        adjustedQueue.splice(adjustedQueue.length + delta, -delta);
    }

    let grid: Grid = adjustedQueue
        .map(pieceId => previewGridSettings[pieceId])
        .reduce((accum, piecePreview) => {
            piecePreview.forEach(row => accum.push(row));
            return accum
        }, []);
    let bufferSpace = new Array(grid[0].length).fill(0);
    grid.push(bufferSpace);

    return grid;
}
