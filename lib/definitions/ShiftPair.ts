import ShiftDirection from "./ShiftDirection";

type ShiftPair<T> = Record<ShiftDirection, T>

// Diff utils
namespace ShiftPair {

    export const diff = <T>(before: ShiftPair<T>, after: ShiftPair<T>) => {
        if (!before && !after) { return null }
        if (!before || !after) { return after }
        const diff: Partial<ShiftPair<T>> = {}
        if (before[ShiftDirection.Left] != after[ShiftDirection.Left]) {
            diff[ShiftDirection.Left] = after[ShiftDirection.Left]
        }
        if (before[ShiftDirection.Right] != after[ShiftDirection.Right]) {
            diff[ShiftDirection.Right] = after[ShiftDirection.Right]
        }
        const returnValue = Object.keys(diff).length > 0 ? diff : null
        return returnValue satisfies Partial<ShiftPair<T>>
    }

}

export default ShiftPair