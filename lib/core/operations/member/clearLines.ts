import Cell from "../../../definitions/Cell"
import Operation from "../../definitions/CoreOperation"
import CorePreconditions from "../../utils/CorePreconditions"

let rootOperation = (lines: number[]) => Operation.Resolve(({ state }, { schema }) => {
    if (lines.length == 0) {
        return Operation.None
    } 
    let lowestRowToClear = Math.max(...lines)

    let linesToShift = state.playfield.reduce((accum, row, i) => {
        let isLineToClear = !lines.includes(i) && i < lowestRowToClear && row.some(cell => !Cell.isEmpty(cell))
        return isLineToClear ? [...accum, row] : accum
    }, [] as Cell[][])

    let shiftStart = lowestRowToClear - linesToShift.length + 1

    return Operation.Draft(({ state }) => {
        for (let i = shiftStart; i <= lowestRowToClear; i++) {
            state.playfield[i] = [...linesToShift[i-shiftStart]]
        }
        for (let i = shiftStart - lines.length; i < shiftStart; i++) {
            state.playfield[i] = new Array(schema.playfield.columns).fill(Cell.Empty)
        }
    })
})

export default (lines: number[]) => Operation.Export({
    operationName: "clearLines",
    preconditions: [ CorePreconditions.activeGame ],
    rootOperation: rootOperation(lines)
})
