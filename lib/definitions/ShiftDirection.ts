enum ShiftDirection {
    Right = 1,
    Left = -1
}

// Convenience
namespace ShiftDirection {

    export const opposite = (direction: ShiftDirection): ShiftDirection => -direction

}
export default ShiftDirection