import Orientation from "../../../definitions/Orientation"

type BoundingBoxOffsets = Record<Orientation, [number, number]>

// Convenience
namespace BoundingBoxOffsets {

    export const None: BoundingBoxOffsets = {
        [Orientation.North]: [0, 0],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [0, 0]
    }

}

export default BoundingBoxOffsets