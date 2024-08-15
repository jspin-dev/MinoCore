import GridBuilder from "./definitions/GridBuilder";
import type PieceIdentifier from "../../definitions/PieceIdentifier";
import BinaryGrid from "../../definitions/BinaryGrid";
import { createEmptyGrid, mapRecordValues } from "../../util/sharedUtils";

/**
 * Normalizes the grids of all pieces so they can be aligned and arranged together using gridBuilderAddon.
 * They should be saved in the local state and only regenerated if the pieces or config change,
 * rather than every time gridBuilderAddon is invoked. Pieces are centered and coerced to the same width and height
 * @param pieces Pieces to be normalized
 * @param config Specifies left/right alignment bias and additional horizontal padding
 */
export default (
    pieces: Record<PieceIdentifier, BinaryGrid>,
    config: GridBuilder.Config = GridBuilder.Config.defaults
) => {
    let grids = mapRecordValues(pieces, trimGrid)
    let baseDimensions = findMaxDimensions(grids)
    let paddedDimensions = { ...baseDimensions, width: baseDimensions.width + config.margins.horizontal * 2 }
    let normalizedGrids = mapRecordValues(grids, grid => applyPadding(grid, paddedDimensions, config.alignmentBias))
    normalizedGrids[0] = createEmptyGrid(paddedDimensions.height, paddedDimensions.width, 0)
    return normalizedGrids
}

const findMaxDimensions = (grids: Record<PieceIdentifier, BinaryGrid>) => {
    return Object.values(grids).reduce((dimens, grid) => {
        return {
            height: grid.length > dimens.height ? grid.length : dimens.height,
            width: grid[0].length > dimens.width ? grid[0].length : dimens.width
        }
    }, { width: 0, height: 0 })
}

const applyPadding = (
    grid: BinaryGrid,
    finalDimensions: { width: number, height: number },
    alignmentBias: GridBuilder.Config.AlignmentBias
) => {
    const emptyRow = (n: number) => new Array(n).fill(0)
    const padding = calculatePadding(grid, finalDimensions, alignmentBias)
    const horizontallyPaddedGrid = grid.reduce((accum, row) => {
        return [...accum, [...emptyRow(padding.left), ...row, ...emptyRow(padding.right)]]
    }, [] as BinaryGrid)
    return [
        ...createEmptyGrid(padding.top, finalDimensions.width, 0),
        ...horizontallyPaddedGrid,
        ...createEmptyGrid(padding.bottom, finalDimensions.width, 0)
    ]
}

const trimGrid = (grid: BinaryGrid) => {
    const start = grid.reduce((accum, row) => {
        let i = row.indexOf(1)
        return i > -1 && i < accum ? i : accum
    }, Number.MAX_SAFE_INTEGER)
    const end = grid.reduce((accum, row) => {
        let i = row.lastIndexOf(1) + 1
        return i > accum ? i : accum
    }, 0)
    return grid.reduce((accumRows, row, index) => {
        let isPaddedTop = row.every(i => i == 0) && accumRows.length == 0
        let isPaddedBottom = grid.slice(index).every(row => row.every(i => i == 0))
        if (isPaddedTop || isPaddedBottom) {
            return accumRows
        }
        let newRow = end > 0 ? row.slice(start, end) : row.slice(start)
        return [...accumRows, newRow]
    }, [] as BinaryGrid)
}

const calculatePadding = (
    grid: BinaryGrid,
    requiredDimensions: { width: number, height: number },
    alignmentBias: GridBuilder.Config.AlignmentBias
) => {
    const horizontalPadding = requiredDimensions.width - grid[0].length
    const primaryHorizontalPadding = Math.floor(horizontalPadding / 2)
    const remainingHorizontalPadding = horizontalPadding - primaryHorizontalPadding

    const verticalPadding = requiredDimensions.height - grid.length
    const primaryVerticalPadding = Math.floor(verticalPadding / 2)
    const remainingVerticalPadding = verticalPadding - primaryVerticalPadding

    const leftAligned = alignmentBias.horizontal == GridBuilder.Config.AlignmentBias.Horizontal.Left
    const topAligned = alignmentBias.vertical == GridBuilder.Config.AlignmentBias.Vertical.Top

    return {
        left: leftAligned ? primaryHorizontalPadding : remainingHorizontalPadding,
        right: leftAligned ? remainingHorizontalPadding : primaryHorizontalPadding,
        top: topAligned ? primaryVerticalPadding : remainingVerticalPadding,
        bottom: topAligned ? remainingVerticalPadding : primaryVerticalPadding
    }
}
