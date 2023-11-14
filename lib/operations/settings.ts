import type { Settings } from "../definitions/settingsDefinitions";
import { RotationGridSet, Offset, Orientation } from "../definitions/rotationDefinitions";
import { createEmptyGrid, rotateGrid, gridToList } from "../util/sharedUtils";
import { clearGhost, refreshGhost } from "./ghost";
import { State } from "../types/stateTypes";
import { Grid } from "../types/sharedTypes";

export namespace RotationSettings {

    let translate = (grid: Grid, offset: Readonly<Offset>): Grid => {
        let list = gridToList(grid, offset[0], offset[1], 1);
        let newGrid = createEmptyGrid(grid.length, grid[0].length, 0);
        list.forEach(coordinate => newGrid[coordinate.y][coordinate.x] = 1);
        return newGrid;
    }
    
    export let validate: Provider = {
        provide: ({ settings }: State) => {
            let { rotationGrids, shapes, rotationStateInfo } = settings.rotationSystem[0];

            if (rotationGrids != null) {
                return [];
            }
    
            let updatedGrids: RotationGridSet[] = shapes.map((shape, i) => {
                let stateInfo = rotationStateInfo.find(info => info.pieces.includes(i + 1));
    
                let northGrid: Grid = [...shape.map(s => [...s])];
                let eastGrid = rotateGrid(northGrid);
                let southGrid = rotateGrid(eastGrid);
                let westGrid = rotateGrid(southGrid);
    
                let pureRotations = [northGrid, eastGrid, southGrid, westGrid];
    
                // Since there is no state info, we can only provide pure rotations
                if (!stateInfo) {
                    return {
                        [Orientation.North]: pureRotations[Orientation.North],
                        [Orientation.East]: pureRotations[Orientation.East],
                        [Orientation.South]: pureRotations[Orientation.South],
                        [Orientation.West]: pureRotations[Orientation.West]
                    }
                }
    
                let northRotationState = stateInfo.states[Orientation.North];
                let eastRotationState = stateInfo.states[Orientation.East];
                let southRotationState = stateInfo.states[Orientation.South];
                let westRotationState = stateInfo.states[Orientation.West];
    
                return {
                    [Orientation.North]: translate(
                        pureRotations[northRotationState.pureRotationIndex], 
                        northRotationState.offset || [0, 0]
                    ),
                    [Orientation.East]: translate(
                        pureRotations[eastRotationState.pureRotationIndex],  
                        eastRotationState.offset || [0, 0]
                    ),
                    [Orientation.South]: translate(
                        pureRotations[southRotationState.pureRotationIndex],  
                        southRotationState.offset || [0, 0]
                        ),
                    [Orientation.West]: translate(
                        pureRotations[westRotationState.pureRotationIndex],  
                        westRotationState.offset || [0, 0]
                    )
                }
            });
            
            return {
                draft: draft => {
                    draft.settings.rotationSystem[0].rotationGrids = updatedGrids;
                }
            }
        }
    }

}

export let initSettings = (settings: Settings): Drafter => {
    return {
        draft: draft => { draft.settings = settings }
    }
}

export let setGhostEnabled = (enabled: boolean): Provider => {
    let changeSetting: Drafter = {
        draft: draft => { draft.settings.ghostEnabled = enabled }
    }
    return {
        provide: () => [
            changeSetting,
            enabled ? refreshGhost : clearGhost
        ]
    }
}

export let setDasPreservationEnabled = (enabled: boolean): Drafter => {
    return {
        draft: draft => { draft.settings.dasPreservationEnabled = enabled }
    }
}

export let setDasInteruptionEnabled = (enabled: boolean): Drafter => {
    return {
        draft: draft => { draft.settings.dasInteruptionEnabled = enabled }
    }
}

export namespace Handling {

    export let setDAS = (das: number): Drafter => {
        return {
            draft: draft => { draft.settings.das = das }
        }
    }

    export let setARR = (arr: number): Drafter => {
        return {
            draft: draft => { draft.settings.arr = arr }
        }
    }

    export let setSDF = (softDropInterval: number): Drafter => {
        return {
            draft: draft => { draft.settings.softDropInterval = softDropInterval }
        }
    }

}
