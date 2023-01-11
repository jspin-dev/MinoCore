import type { Grid } from "../definitions/sharedDefinitions";
import type { Coordinate } from "../definitions/playfieldDefinitions";

export function gridToList(grid: Grid, dx: number, dy: number, n: number): Coordinate[] {
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

export function createEmptyGrid(rows: number, columns: number, n: number): Grid {
    return Array.from({
        length: rows
    }, () => new Array(columns).fill(n));
}

export function copyGrid(grid: Readonly<Grid>) {
    return grid.map(row => [...row]);
}

export function getGridDiff(oldGrid: Grid, newGrid: Grid) {
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

export function gridContainsOnly(grid: Grid, targetValue: number) {
    return grid.every(row => {
        return row.every(element => element === targetValue);
    });
}

/**
 * Accepts a list of numbers along with a list of random 0-1 numbers 
 */
export function shuffle(
    unshuffledBag: readonly number[], 
    randomNumbers: readonly number[]
): number[] {
    if (unshuffledBag.length != randomNumbers.length + 1) {
        throw "Bag length must be rns length + 1";
    }
    let bag = [...unshuffledBag];
    return [
        ...randomNumbers.map(randomNum => {
            var randomPieceIndex = Math.floor(randomNum * bag.length);
            return bag.splice(randomPieceIndex, 1)[0];
        }),
        bag[0]
    ]
}

export function rotateGrid(matrix: Grid): Grid {
    return matrix[0].map((_, index) => {
        return matrix.map(row => row[index]).reverse();
    });
}

export function cropGrid(grid: Grid): Grid {
    let topBound: number, bottomBound: number;
    grid.forEach((row, i) => {
        if (row.some(element => element > 0)) {
            if (topBound == null) {
                topBound = i;
            }
            bottomBound = i;
        }
    });

    grid = grid.slice(topBound, bottomBound + 1);

    let leftBound = grid[0].length;
    let rightBound = 0;
    grid.forEach(row => {
        let left = row.findIndex(element => element > 0);
        if (left >= 0 && left < leftBound) {
            leftBound = left;
        }

        let right = 0;
        for (let i = row.length; i >= 0; i--) {
            if (row[i] > 0) {
                right = i;
                break;
            }
        }
        if (right >= 0 && right > rightBound) {
            rightBound = right;
        }
    });

    return grid.map(row => row.slice(leftBound, rightBound + 1));
}
