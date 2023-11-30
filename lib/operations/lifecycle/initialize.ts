import { WritableDraft } from "immer/dist/internal"
import Operation from "../../definitions/Operation"
import { GameStatus, SideEffectRequest } from "../../definitions/metaDefinitions"
import { Settings } from "../../definitions/settingsDefinitions"
import { createEmptyGrid } from "../../util/sharedUtils"
import { Hold, Meta, Playfield, Preview, Statistics } from "../../definitions/stateTypes"
import { LockdownStatus } from "../../definitions/lockdownDefinitions"

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
    status: GameStatus.Ready,
    activeInputs: [],
    activeLeftShiftDistance: 0,
    activeRightShiftDistance: 0,
    activeDropDistance: 0,
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
    queue: [],
    randomNumbers: []
}

let initializeState = (settings: Settings) =>  Operation.Draft(({ state }) => {
    Object.assign(state, {
        playfield: initialPlayfield(settings) as WritableDraft<Playfield>,
        meta: initialMeta as WritableDraft<Meta>,
        settings: settings as WritableDraft<Settings>,
        hold: initialHold as WritableDraft<Hold>,
        preview: initialPreview as WritableDraft<Preview>,
        statistics: initialStats
    })
})

let requestRns = Operation.Draft(({ state, sideEffectRequests }) => {
    sideEffectRequests.push(SideEffectRequest.Rng(state.settings.rotationSystem.shapes.length - 1))
})

export default Operation.Provide((_, { defaultSettings, operations }) => Operation.Sequence(
    initializeState(defaultSettings),
    operations.validatePreviewGrids,
    requestRns,
    operations.syncPreviewGrid
))