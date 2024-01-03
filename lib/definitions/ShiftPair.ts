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

    export let diff = <T>(before: ShiftPair<T>, after: ShiftPair<T>): Diff<T> => {
        if (!before && !after) { return null }
        if (!before || !after) { return after }
        let diff: Diff<T> = {}
        if (before[ShiftDirection.Left] != after[ShiftDirection.Left]) {
            diff[ShiftDirection.Left] = after[ShiftDirection.Left]
        }
        if (before[ShiftDirection.Right] != after[ShiftDirection.Right]) {
            diff[ShiftDirection.Right] = after[ShiftDirection.Right]
        }
        return Object.keys(diff).length > 0 ? diff : null
    }

}

export default ShiftPair