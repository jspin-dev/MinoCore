import Coordinate from "../../definitions/Coordinate";
import Grid from "../../definitions/Grid";
import GameSchema from "../../schemas/definitions/GameSchema";
import { willCollide } from "../../util/stateUtils";
import ActivePiece from "../definitions/ActivePiece";
import Cell from "../definitions/Cell";
import ShiftDirection from "../definitions/ShiftDirection";

export let findInstantDropDistance = (
    coordinates: Coordinate[],
    playfieldGrid: Grid<Cell>,
    playfieldSpec: GameSchema.PlayfieldSpec
): number => {
    let verticalCollision = false;
    let dy = 0;
    if (coordinates.length > 0) {
        while (!verticalCollision) {
            dy++;
            verticalCollision = willCollide(playfieldGrid, playfieldSpec, coordinates, 0, dy);
        }
    }
    return dy - 1;
}

export let findInstantShiftDistance = (
    direction: ShiftDirection, 
    activePiece: ActivePiece,
    playfieldGrid: Grid<Cell>,
    playfieldSpec: GameSchema.PlayfieldSpec
): number => {
    if (activePiece.coordinates.length == 0) { return -1 } 
    if (!direction || willCollide(playfieldGrid, playfieldSpec, activePiece.coordinates, direction, 0)) {
        return 0;
    }
    let horizontalCollision = false;
    let dx = 0;

    while (!horizontalCollision) {
        dx += direction;
        horizontalCollision = willCollide(playfieldGrid, playfieldSpec, activePiece.coordinates, dx, 0);
    }
    return Math.abs(dx - direction); // Shift function expects a positive integer
}

