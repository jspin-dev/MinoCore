// import CoreState from "../../definitions/CoreState";
// import OperationResult from "../../definitions/CoreOperationResult";
// import Operation from "../../definitions/Operation";
// import Orientation from "../../schemas/definitions/Orientation";
// import Grid from "../../definitions/Grid";
// import { createEmptyGrid } from "../../util/sharedUtils";
// import Settings from "../../definitions/Settings";
// import GameEvent from "../../definitions/GameEvent";
// import GridState from "./definitions.ts/GridState";
// import Cell from "../../definitions/Cell";
// import { Draft, WritableDraft } from "immer/dist/internal";
// import BinaryGrid from "../../schemas/definitions/BinaryGrid";
// import PieceIdentity from "../../schemas/definitions/PieceIdentifier";

// export default <P extends Identifiable>(coreResult: OperationResult<P, CoreState<P>>): Operation<GridState<P>, void> => {
//     let validatePreviewGridSettings = Operation.Provide<GridState<P>, void>(state => {
//         return generatePreviewGridSettings(coreResult.state).applyIf(state.previewGrids == null);
//     })
//     return Operation.Sequence(validatePreviewGridSettings, syncNextQueue(coreResult), syncHoldQueue(coreResult))
// }

// let syncNextQueue = <P extends Identifiable>(coreResult: OperationResult<P, CoreState<P>>) => Operation.Provide<GridState<P>, void>(state => {
//     let nextEventFound = coreResult.events.some(event => {
//         return event.classifier == GameEvent.Classifier.Dequeue || GameEvent.Classifier.Enqueue
//     });
//     if (nextEventFound || state.nextPreview == null || state.nextPreview.length == 0) {
//         let grid = generatePreviewGrid(coreResult.state.previewQueue, state.previewGrids, coreResult.state.settings);
//         return Operation.Draft((state) => { state.nextPreview = grid as WritableDraft<Grid<Cell<P>>> }); 
//     } else {
//         return Operation.None()
//     }
// })

// let syncHoldQueue = <P extends Identifiable>(coreResult: OperationResult<P, CoreState<P>>) => Operation.Provide<GridState<P>, void>(state => {
//     let holdEventFound = coreResult.events.some(event => event.classifier == GameEvent.Classifier.Hold);
//     if (holdEventFound || state.holdPreview == null || state.holdPreview.length == 0) {
//         let grid: Grid<Cell<P>> = createHoldGrid(state.previewGrids, coreResult.state.holdPieceId);
//         return Operation.Draft(state => { state.holdPreview = grid as WritableDraft<Grid<Cell<P>>>});
//     } else {
//         return Operation.None();
//     }
// })

// let generatePreviewGridSettings = <P extends Identifiable>(state: CoreState<P>): Operation<GridState<P>, void> => {
//     let shapes = new Map<P, BinaryGrid>()
//     for (var [key, value] of state.settings.rotationSystem.rotationGrids.entries()) {
//         let grid = [...value[Orientation.North].map(it => [...it])]; // copying each grid
//         shapes.set(key, grid);
//     }
//     let grids = createPreviewGridSettings(shapes, 1);
//     return Operation.Draft(state => { 
//         state.previewGrids = grids as Map<Draft<P>, WritableDraft<Grid<Cell<P>>>>
//     })
// }

// // Utils

// let createHoldGrid = <P extends Identifiable>(previewGrids: Map<P, Grid<Cell<P>>>, pieceId?: P): Grid<Cell<P>> => {
//     let grid = previewGrids.get(pieceId).map(row => [...row])
//     let bufferSpace = new Array(grid[0].length).fill(Cell.Empty);
//     return [...grid, bufferSpace];
// }

// let generatePreviewGrid = <P extends Identifiable>(
//     queue: readonly P[], 
//     previewGrids: Map<P, Grid<Cell<P>>>, 
//     settings: Settings<P>
// ): Grid<Cell<P>> => {
//     let adjustedQueue = [ ...queue ];
//     let delta = settings.nextPreviewSize - queue.length;
//     if (delta > 0) {
//         adjustedQueue = queue.concat(new Array(delta).fill(0));
//     } else if (delta < 0) {
//         adjustedQueue.splice(adjustedQueue.length + delta, -delta);
//     }

//     let grid: Grid<Cell<P>> = adjustedQueue
//         .map(piece => previewGrids.get(piece))
//         .reduce((accum, piecePreview) => {
//             piecePreview.forEach(row => accum.push(row));
//             return accum
//         }, []);
//     let bufferSpace = new Array(grid[0].length).fill(0);
//     grid.push(bufferSpace);

//     return grid;
// }

// let createPreviewGridSettings = <P extends Identifiable>(grids: Map<P, BinaryGrid>, padding: number):  Map<P, Grid<Cell<P>>> => {        
//     let grids2: Grid<Cell<P>>[] = []
//     for (var [key, value] of grids.entries()) {
//         let mappedGrid = cropGrid(value).map(row => row.map(value => value == 0 ? Cell.Empty : Cell.Mino(key)));
//         grids2.push(mappedGrid);
//     }

//     let previewGridHeight = grids2.reduce((max, g) => {
//         return g.length > max ? g.length : max;
//     }, 0) + padding;

//     grids2 = grids2.map(g => {
//         let frac = (previewGridHeight - g.length) / 2;
//         let topPadding = createEmptyGrid(Math.ceil(frac), g[0].length, Cell.Empty as Cell<P>);
//         let bottomPadding = createEmptyGrid(Math.floor(frac), g[0].length, Cell.Empty as Cell<P>);
//         return topPadding.concat(g, bottomPadding);
//     });

//     let previewGridWidth = grids2.reduce((max, grid) => {
//         return grid[0].length > max ? grid[0].length : max;
//     }, 0) + padding * 2;

//     grids2 = grids2.map(g => {
//         let frac = (previewGridWidth - g[0].length) / 2;
//         let leftPadding = new Array(Math.floor(frac)).fill(0);
//         let rightPadding = new Array(Math.ceil(frac)).fill(0);
//         return g.map(row => leftPadding.concat(row, rightPadding));
//     });

//     let arr = [
//         createEmptyGrid(previewGridHeight, previewGridWidth, Cell.Empty as Cell<P>),
//         ...grids2
//     ];

//     let returnGridMap: Map<P, Grid<Cell<P>>> = new Map()
//     let pieces = Array.from(grids.keys())
//     arr.forEach((value, i) => {
//         returnGridMap.set(pieces[i], value)
//     })
//     return returnGridMap;
// } 


// let cropGrid = (grid: BinaryGrid): BinaryGrid => {
//     let topBound: number, bottomBound: number;
//     grid.forEach((row, i) => {
//         if (row.some(element => element > 0)) {
//             if (topBound == null) {
//                 topBound = i;
//             }
//             bottomBound = i;
//         }
//     });

//     grid = grid.slice(topBound, bottomBound + 1);

//     let leftBound = grid[0].length;
//     let rightBound = 0;
//     grid.forEach(row => {
//         let left = row.findIndex(element => element > 0);
//         if (left >= 0 && left < leftBound) {
//             leftBound = left;
//         }

//         let right = 0;
//         for (let i = row.length; i >= 0; i--) {
//             if (row[i] > 0) {
//                 right = i;
//                 break;
//             }
//         }
//         if (right >= 0 && right > rightBound) {
//             rightBound = right;
//         }
//     });

//     return grid.map(row => row.slice(leftBound, rightBound + 1));
// }

export default {}