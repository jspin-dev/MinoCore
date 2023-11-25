import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { Rotation } from "../../definitions/rotationDefinitions";
import recordStep from "./recordStep";

export default (rotation: Rotation) => Operation.Provide(() => {
    let count = rotation == Rotation.Degrees180 ? 2 : 1;
    return recordStep(MovementType.Rotate, count);
})