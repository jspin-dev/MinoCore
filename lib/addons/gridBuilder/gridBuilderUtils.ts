import type PieceIdentifier from "../../definitions/PieceIdentifier"
import BinaryGrid from "../../definitions/BinaryGrid"
import GridBuilder from "./definitions/GridBuilder"
import Grid from "../../definitions/Grid"
import { createEmptyGrid } from "../../util/sharedUtils"

export const buildPreviewGrid = (
    pieceIds: PieceIdentifier[],
    gridCache: Record<PieceIdentifier, BinaryGrid>,
    config: GridBuilder.Config
): Grid<GridBuilder.Cell> => {
    const gridWidth = Object.values(gridCache)[0][0].length
    const spacerRow = createEmptyGrid(config.spacing, gridWidth, GridBuilder.Cell.Empty)
    const verticalPaddingGrid = createEmptyGrid(config.margins.vertical, gridWidth, GridBuilder.Cell.Empty)
    const midRows = pieceIds.reduce((accum, id, i) => {
        return [
            ...accum,
            ...binaryGridToCells(id, gridCache[id]),
            ...(i == pieceIds.length - 1 ? [] : spacerRow)
        ]
    }, [] as Grid<GridBuilder.Cell>)
    return [...verticalPaddingGrid, ...midRows, ...verticalPaddingGrid]
}

export const binaryGridToCells = (id: PieceIdentifier, grid: BinaryGrid) => {
    return grid.map(row => row.map(i => i == 0 ? GridBuilder.Cell.Empty : GridBuilder.Cell.Solid(id)))
}