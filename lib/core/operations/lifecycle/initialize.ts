import CorePreconditions from "../../utils/CorePreconditions"
import { sequence, withPreconditions } from "../../../util/operationUtils"
import {mapFromDependencies, updateCoreState} from "../../utils/coreOperationUtils"

const rootOperation = (rns: number[]) => mapFromDependencies(({ schema, operations }) => sequence(
    updateCoreState({ randomNumbers: rns }),
    schema.rotationSystem.initialize,
    operations.refillQueue
))

// noinspection JSUnusedGlobalSymbols
export default (rns: number[]) => withPreconditions({
    operationName: "initialize",
    operation: rootOperation(rns),
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})