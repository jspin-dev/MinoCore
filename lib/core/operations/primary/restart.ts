import {addEvent, cancelAllPendingOperations, mapFromOperations} from "../../utils/coreOperationUtils"
import { sequence } from "../../../util/operationUtils"
import CoreResult from "../../definitions/CoreResult"
import GameEvent from "../../../definitions/GameEvent";

// noinspection JSUnusedGlobalSymbols
export default (rns: number[]) => mapFromOperations(operations => sequence(
    ({ state }, { schema }) => CoreResult.initial(state.settings, schema, rns),
    addEvent(GameEvent.Restart),
    cancelAllPendingOperations,
    operations.initialize,
    operations.start
))
