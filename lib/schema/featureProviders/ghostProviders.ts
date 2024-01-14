import Cell from "../../definitions/Cell"
import GhostProvider from "../definitions/GhostProvider"

namespace GhostProviders {

    export const noGhost = { calculateCoordinates: () => [] } satisfies GhostProvider

    export const classic = {
        calculateCoordinates({ state }) {
            const { activePiece, playfield } = state
            return activePiece.coordinates
                .map(c => { return { x: c.x, y: c.y + activePiece.availableDropDistance } })
                .filter(c => {
                    let cell = playfield[c.y][c.x]
                    return Cell.isEmpty(cell) || Cell.isGhost(cell)
                })
        }
    } satisfies GhostProvider

}
export default GhostProviders