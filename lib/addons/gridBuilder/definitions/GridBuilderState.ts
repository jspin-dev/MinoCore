import type PieceIdentifier from "../../../definitions/PieceIdentifier"
import Grid from "../../../definitions/Grid"
import BinaryGrid from "../../../definitions/BinaryGrid"
import CoreState from "../../../core/definitions/CoreState"
import GameSchema from "../../../schema/definitions/GameSchema"
import {mapRecordValues} from "../../../util/sharedUtils"
import buildGridCache from "../gridNormalizer"
import {buildPreviewGrid} from "../gridBuilderUtils"
import GridBuilder from "./GridBuilder"

export namespace GridBuilderState {

    export interface Hold {
        pieceId: PieceIdentifier
        grid: Grid<GridBuilder.Cell>
    }

    export interface NextPreview {
        pieces: PieceIdentifier[]
        grid: Grid<GridBuilder.Cell>
    }

    export const initial = (
        coreState: CoreState,
        schema: GameSchema,
        config: GridBuilder.Config = GridBuilder.Config.defaults
    ) => {
        const initialGrids = mapRecordValues(schema.rotationSystem.pieces, spec => spec.grids[spec.spawnOrientation])
        const gridCache = buildGridCache(initialGrids, config)
        const initialPreviewIds = new Array(schema.pieceGenerator.minQueueLength).fill(0)
        const nextPreviewGrid = buildPreviewGrid(initialPreviewIds, gridCache, config)
        const holdGrid = buildPreviewGrid([coreState.holdPiece ?? 0], gridCache, config)
        return {
            hold: { pieceId: coreState.holdPiece, grid: holdGrid },
            nextPreview: { pieces: coreState.previewQueue, grid: nextPreviewGrid },
            gridCache
        }
    }

}

export interface GridBuilderState {
    hold: GridBuilderState.Hold
    nextPreview: GridBuilderState.NextPreview
    gridCache: Record<PieceIdentifier, BinaryGrid>
}
