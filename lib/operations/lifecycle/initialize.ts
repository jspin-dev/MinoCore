import { WritableDraft } from "immer/dist/internal"
import Operation from "../../definitions/Operation"
import { GameStatus, SideEffectRequest } from "../../definitions/metaDefinitions"
import { Settings } from "../../definitions/settingsDefinitions"
import { createEmptyGrid } from "../../util/sharedUtils"
import { Hold, Meta, Playfield, Preview, State, Statistics } from "../../definitions/stateTypes"
import { LockdownStatus } from "../../definitions/lockdownDefinitions"
import validatePreviewGrids from "../next/validatePreviewGrids"
import syncPreviewGrid from "../next/syncPreviewGrid"
import updateStatus from "./updateStatus"

let initialStats: Statistics = {
    level: 1,
    lines: 0,
    keysPressed: 0,
    piecesLocked: 0,
    time: 0,
    kpp: 0,
    pps: 0,
    steps: {
        drop: 0,
        rotate: 0,
        shift: 0,
        hold: 0
    },
    finesse: 0,
    scoreState: {
        lastLockScoreAction: null,
        score: 0,
        combo: -1
    },
    actionTally: {}
}

let initialPlayfield = (settings: Settings): Playfield => {
    return {
        grid: createEmptyGrid(settings.rows, settings.columns, 0),
        spinSnapshot: null,
        activePiece: {
            id: null,
            location: null,
            coordinates: [],
            ghostCoordinates: [],
            orientation: null,
            activeRotation: false
        },
        lockdownInfo: {
            status: LockdownStatus.NoLockdown,
            largestY: 0
        }
    }
}

let initialMeta: Meta = {
    status: GameStatus.Initialized,
    previousStatus: null,
    activeInputs: [],
    softDropActive: false,
    dasRightCharged: false,
    dasLeftCharged: false,
    direction: null
}

let initialHold: Hold = {
    enabled: true, 
    grid: [], 
    pieceId: null 
}

let initialPreview: Preview = {
    grid: [],
    dequeuedPiece: null,
    queue: [],
    randomNumbers: []
}

let initializeState = (settings: Settings) =>  Operation.Draft(draft => {
    draft.playfield = initialPlayfield(settings) as WritableDraft<Playfield>
    draft.meta = initialMeta as WritableDraft<Meta>
    draft.settings = settings as WritableDraft<Settings>
    draft.hold = initialHold as WritableDraft<Hold>
    draft.preview = initialPreview as WritableDraft<Preview>
    draft.statistics = initialStats
})

let requestRns = Operation.Provide(({ settings }) => {
    return Operation.Request(SideEffectRequest.Rng(settings.rotationSystem.shapes.length - 1))
})

export default (settings: Settings) => Operation.Sequence(
    initializeState(settings),
    validatePreviewGrids,
    requestRns,
    syncPreviewGrid,
    updateStatus(GameStatus.Ready)
)