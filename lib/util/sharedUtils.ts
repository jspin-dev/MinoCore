import type Coordinate from "../definitions/Coordinate"
import type Grid from "../definitions/Grid"

export let gridToList = <T>(grid: Grid<T>, dx: number, dy: number, n: number): Coordinate[] => {
    let blockArray = <Coordinate[]>[]
    grid.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block == n) {
                blockArray.push({ x: x + dx, y: y + dy })
            }
        })
    })
    return blockArray
}

export let createEmptyGrid = <T>(rows: number, columns: number, n: T): Grid<T> => {
    return Array.from({
        length: rows
    }, () => new Array(columns).fill(n))
}

export let arraysEqual = <T>(
    t1: T[],
    t2: T[],
    equal: (t1: T, t2: T) => boolean = ((t1, t2) => { return t1 == t2 })
): boolean => {
    return t1.length == t2.length && t1.every((value, i) => equal(t2[i], value))
}

export let copyGrid = <T>(grid: Readonly<Grid<T>>) => {
    return grid.map(row => [...row])
}

export let getGridDiff = <T>(oldGrid: Grid<T>, newGrid: Grid<T>) => {
    let diff = []
    for(let i = 0; i < oldGrid.length; i++) {
        for(let j = 0; j < oldGrid[i].length; j++) {
            let item1 = oldGrid[i][j]
            let item2 = newGrid[i][j]
            if (item1 !== item2) {
                diff.push([j, i, item2])
            }
        }
    }
    return diff
}

