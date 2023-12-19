import Operation from "../../definitions/CoreOperation"

export default Operation.Resolve(({ state }, { operations }) => {
    let { settings, activePiece, softDropActive } = state;
    let shouldInstantDrop = settings.softDropInterval === 0 && activePiece.availableDropDistance > 0 && softDropActive
    return shouldInstantDrop ? operations.drop(activePiece.availableDropDistance) : Operation.None
})
