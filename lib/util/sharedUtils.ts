import type Coordinate from "../definitions/Coordinate";
import Grid from "../definitions/Grid";

export let gridToList = (grid: Grid<number>, dx: number, dy: number, n: number): Coordinate[] => {
    var blockArray = <Coordinate[]>[];
    grid.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block == n) {
                blockArray.push({ x: x + dx, y: y + dy });
            }
        })
    })
    return blockArray;
}

export let createEmptyGrid = <T>(rows: number, columns: number, n: T): Grid<T> => {
    return Array.from({
        length: rows
    }, () => new Array(columns).fill(n));
}

export let copyGrid = <T>(grid: Readonly<Grid<T>>) => {
    return grid.map(row => [...row]);
}

export let getGridDiff = <T>(oldGrid: Grid<T>, newGrid: Grid<T>) => {
    let diff = [];
    for(var i = 0; i < oldGrid.length; i++) {
        for(var j = 0; j < oldGrid[i].length; j++) {
            let item1 = oldGrid[i][j];
            let item2 = newGrid[i][j];
            if (item1 !== item2) {
                diff.push([j, i, item2]);
            }
        }
    }
    return diff;
}

