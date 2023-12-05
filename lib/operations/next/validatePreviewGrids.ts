import { cropGrid, createEmptyGrid, } from "../../util/sharedUtils";
import Operation from "../../definitions/CoreOperation";
import { Grid } from "../../definitions/shared/Grid";
import { Orientation } from "../../definitions/rotationDefinitions";

export default Operation.Provide((_, { operations }) => Operation.Sequence(
    operations.validateRotationSettings, 
    createPreviewGridsProvider
))

let createPreviewGridsProvider = Operation.Provide(({ state }) => {
    let rotationSystem = state.settings.rotationSystem;
    if (rotationSystem.previewGrids != null) {
        return Operation.None;
    }
    let shapes = rotationSystem.rotationGrids.map(info => {
        return [...info[Orientation.North].map(it => [...it])] // copying each grid
    });
    let grids = createPreviewGridSettings(shapes, 1);
    return Operation.Draft(({ state }) => { state.settings.rotationSystem.previewGrids = grids })
})

let createPreviewGridSettings = (grids: readonly Grid[], padding: number): Grid[] => {        
    grids = grids.map((g, i) => {
        return cropGrid(g).map(row => row.map(num => num == 0 ? 0 : i + 1));
    });

    let previewGridHeight = grids.reduce((max, g) => {
        return g.length > max ? g.length : max;
    }, 0) + padding;

    grids = grids.map(g => {
        let frac = (previewGridHeight - g.length) / 2;
        let topPadding = createEmptyGrid(Math.ceil(frac), g[0].length, 0);
        let bottomPadding = createEmptyGrid(Math.floor(frac), g[0].length, 0);
        return topPadding.concat(g, bottomPadding);
    });

    let previewGridWidth = grids.reduce((max, grid) => {
        return grid[0].length > max ? grid[0].length : max;
    }, 0) + padding * 2;

    grids = grids.map(g => {
        let frac = (previewGridWidth - g[0].length) / 2;
        let leftPadding = new Array(Math.floor(frac)).fill(0);
        let rightPadding = new Array(Math.ceil(frac)).fill(0);
        return g.map(row => leftPadding.concat(row, rightPadding));
    });

    return [
        createEmptyGrid(previewGridHeight, previewGridWidth, 0),
        ...grids
    ];
} 
