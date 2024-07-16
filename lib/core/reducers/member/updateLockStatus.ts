import LockdownStatus from "../../definitions/LockdownStatus"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import TimerName from "../../definitions/TimerName"
import MovementType from "../../../definitions/MovementType"
import Outcome from "../../../definitions/Outcome"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"
import CoreState from "../../definitions/CoreState"

import { mapReducer, passthroughReducer, sequence, withCondition, withPreconditions } from "../../../util/reducerUtils"
import { addSideEffectRequest, cancelTimer, createStateReducer, provideReducers } from "../../utils/coreReducerUtils"

const updateLockdownStatus = (newStatus: LockdownStatus) => createStateReducer(({ activePiece }: CoreState) => {
    const depth = activePiece.location.y
    const maxDepth = activePiece.maxDepth
    return {
        lockdownStatus: newStatus,
        activePiece: { ...activePiece, maxDepth: depth > maxDepth ? depth : maxDepth }
    }
})

const getTimerChange = (newStatus: LockdownStatus) => provideReducers(reducers => {
    switch (newStatus.classifier) {
        case LockdownStatus.Classifier.NoLockdown:
        case LockdownStatus.Classifier.Triggered:
            return cancelTimer(TimerName.DropLock)
        case LockdownStatus.Classifier.TimerActive:
            return addSideEffectRequest(
                SideEffectRequest.StartTimer({
                    timerName: TimerName.DropLock,
                    delay: 500,
                    postDelayOp: reducers.triggerLockdown
                })
            )
    }
})

const lockOnTrigger = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    const shouldLock = state.lockdownStatus.classifier == LockdownStatus.Classifier.Triggered
        && state.activePiece.availableDropDistance == 0
    return withCondition(reducers.lock, shouldLock)
})

const rootReducer = (movementType: MovementType) => {
    return mapReducer(({ state }: CoreResult, { schema }: CoreDependencies) => {
        const outcome = schema.lockdownSystem.processMovement({
            movement: movementType,
            lockdownStatus: state.lockdownStatus,
            activePiece: state.activePiece
        })
        return sequence(
            Outcome.isSuccess(outcome)
                ? sequence(updateLockdownStatus(outcome.data), getTimerChange(outcome.data))
                : passthroughReducer,
            lockOnTrigger
        )
    })
}

export default (movementType: MovementType) => withPreconditions({
    reducerName: "updateLockStatus",
    reduce: rootReducer(movementType),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
