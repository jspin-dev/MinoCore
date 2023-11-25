import Operation from "../../definitions/Operation";
import { GameStatus } from "../../definitions/metaDefinitions";

export default (status: GameStatus) => Operation.Draft(draft => {
    Object.assign(draft.meta, { status, previousStatus: draft.meta.status });
})


