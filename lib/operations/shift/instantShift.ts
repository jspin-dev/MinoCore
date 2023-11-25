import Operation from "../../definitions/Operation";
import { willCollide } from "../../util/stateUtils";
import shift from "./shift";

export default Operation.ProvideStrict(({ meta, playfield, settings }) => {
    let activePieceCoordinates = playfield.activePiece.coordinates;
    let direction = meta.direction;
    if (willCollide(activePieceCoordinates, direction, 0, playfield, settings)) {
        return Operation.None;
    }

    let horizontalCollision: boolean, dx = 0;
    while (!horizontalCollision) {
        dx += direction;
        horizontalCollision = willCollide(activePieceCoordinates, dx, 0, playfield, settings);
    }

    let shiftMagnitude = Math.abs(dx - direction); // Shift function expects a positive integer
    return shift(shiftMagnitude);
}) 
