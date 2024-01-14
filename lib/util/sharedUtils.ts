import type Coordinate from "../definitions/Coordinate"
import type Grid from "../definitions/Grid"

export const gridToList = <T>(grid: Grid<T>, dx: number, dy: number, n: number) => {
    const blockArray = <Coordinate[]>[]
    grid.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block == n) {
                blockArray.push({ x: x + dx, y: y + dy })
            }
        })
    })
    return blockArray satisfies Coordinate[]
}

export const createEmptyGrid = <T>(rows: number, columns: number, n: T) => {
    return Array.from({
        length: rows
    }, () => new Array(columns).fill(n)) satisfies Grid<T>
}

export const arraysEqual = <T>(
    t1: T[],
    t2: T[],
    equal: (t1: T, t2: T) => boolean = ((t1, t2) => { return t1 == t2 })
) => {
    return t1.length == t2.length && t1.every((value, i) => equal(t2[i], value))
}

export const copyGrid = <T>(grid: Readonly<Grid<T>>) => {
    return grid.map(row => [...row])
}

export const getGridDiff = <T>(oldGrid: Grid<T>, newGrid: Grid<T>) => {
    const diff = []
    for(let i = 0; i < oldGrid.length; i++) {
        for(let j = 0; j < oldGrid[i].length; j++) {
            const item1 = oldGrid[i][j]
            const item2 = newGrid[i][j]
            if (item1 !== item2) {
                diff.push([j, i, item2])
            }
        }
    }
    return diff
}

