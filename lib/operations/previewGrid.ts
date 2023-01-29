import type { Provider } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { RotationSettings } from "./settings";

import { cropGrid, createEmptyGrid, } from "../util/sharedUtils";
import { getInitialOrientationGrids } from "../util/stateUtils"

export namespace PreviewGridSettings {

    let createPreviewGridsProvider: Provider = {
        provide: ({ settings }) => {
            if (settings.rotationSystem[0].previewGrids != null) {
                return [];
            }
            let shapes = getInitialOrientationGrids(settings.rotationSystem[0]);
            let grids = createPreviewGridSettings(shapes, 1);
            return {
                draft: draft => {
                    draft.settings.rotationSystem[0].previewGrids = grids;
                }
            }
        }
    }

    export let validate: Provider = {
        provide: () => {
            return [
                RotationSettings.validate,
                createPreviewGridsProvider
            ]
        }    
    }

}

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

export let copyPreviewGridSettings = (settings: Settings): Grid[] => { 
    let previewGrids = settings.rotationSystem[0].previewGrids;
    if (previewGrids == null) {
        throw "Use the provider validateGridSettings before attempting to get grid settings";
    }
    return previewGrids.map(grid => {
        return grid.map(row => [...row])
    });
}

