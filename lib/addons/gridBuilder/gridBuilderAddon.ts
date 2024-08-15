import GameSchema from "../../schema/definitions/GameSchema"
import type PieceIdentifier from "../../definitions/PieceIdentifier"
import CoreState from "../../core/definitions/CoreState"
import GridBuilder from "./definitions/GridBuilder"
import { buildPreviewGrid } from "./gridBuilderUtils"
import {GridBuilderState} from "./definitions/GridBuilderState";

const updatePreviewGrids = (
    gridBuilderState: GridBuilderState,
    coreState: CoreState,
    schema: GameSchema,
    config: GridBuilder.Config = GridBuilder.Config.defaults
): GridBuilderState => {
    return {
        ...gridBuilderState,
        hold: getHoldState(gridBuilderState, coreState.holdPiece, config),
        nextPreview: getNextPreviewState(gridBuilderState, coreState.previewQueue, config, schema.pieceGenerator.minQueueLength)
    }
}

const getHoldState = (
    gridBuilderState: GridBuilderState,
    newHoldPiece: PieceIdentifier,
    config: GridBuilder.Config
) => {
    if (newHoldPiece == gridBuilderState.hold?.pieceId) {
        return gridBuilderState.hold
    }
    return {
        ...gridBuilderState.hold,
        pieceId: newHoldPiece,
        grid: buildPreviewGrid([newHoldPiece ?? 0], gridBuilderState.gridCache, config)
    }
}

const getNextPreviewState = (
    gridBuilderState: GridBuilderState,
    newNextPreview: PieceIdentifier[],
    config: GridBuilder.Config,
    queueLength: number
) => {
    if (newNextPreview.every((id, i) => gridBuilderState.nextPreview?.pieces[i] == id)) {
        return gridBuilderState.nextPreview
    }
    const pieceIds = newNextPreview?.length == 0 ? [] : newNextPreview.slice(0, queueLength)
    const fillerPieces = new Array(queueLength - pieceIds.length).fill(0)
    return {
        ...gridBuilderState.nextPreview,
        pieces: newNextPreview,
        grid: buildPreviewGrid([...fillerPieces, ...pieceIds], gridBuilderState.gridCache, config)
    }
}

// noinspection JSUnusedGlobalSymbols
export default updatePreviewGrids
