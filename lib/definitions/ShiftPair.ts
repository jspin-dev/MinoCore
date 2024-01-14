import ShiftDirection from "./ShiftDirection";

interface ShiftPair<T> {
    [ShiftDirection.Right]: T,
    [ShiftDirection.Left]: T
}

// Diff utils
namespace ShiftPair {

    export interface Diff<T> {
        [ShiftDirection.Right]?: T,
        [ShiftDirection.Left]?: T
    }

    export const diff = <T>(before: ShiftPair<T>, after: ShiftPair<T>) => {
        if (!before && !after) { return null }
        if (!before || !after) { return after }
        const diff: Diff<T> = {}
        if (before[ShiftDirection.Left] != after[ShiftDirection.Left]) {
            diff[ShiftDirection.Left] = after[ShiftDirection.Left]
        }
        if (before[ShiftDirection.Right] != after[ShiftDirection.Right]) {
            diff[ShiftDirection.Right] = after[ShiftDirection.Right]
        }
        const returnValue = Object.keys(diff).length > 0 ? diff : null
        return returnValue satisfies Diff<T>
    }

}

export default ShiftPair