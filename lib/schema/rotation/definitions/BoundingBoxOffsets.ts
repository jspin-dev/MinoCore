import Orientation from "../../../definitions/Orientation"

type Offset = [number, number]

interface BoundingBoxOffsets {
    [Orientation.North]: Offset
    [Orientation.East]: Offset
    [Orientation.South]: Offset
    [Orientation.West]: Offset
}

// Convenience
namespace BoundingBoxOffsets {

    export let None: BoundingBoxOffsets = {
        [Orientation.North]: [0, 0],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [0, 0]
    }

}

export default BoundingBoxOffsets