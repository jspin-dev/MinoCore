enum ShiftDirection {
    Right = 1,
    Left = -1
}

// Convenience
namespace ShiftDirection {

    export let opposite = (direction: ShiftDirection): ShiftDirection => {
        return -direction as ShiftDirection
    }

}
export default ShiftDirection