import Operation from "../../definitions/Operation"
import clearGhost from "./clearGhost"
import refreshGhost from "./refreshGhost"

export default (enabled: boolean) => Operation.Sequence(
    Operation.Draft(draft => { draft.settings.ghostEnabled = enabled }),
    enabled ? refreshGhost : clearGhost
)
