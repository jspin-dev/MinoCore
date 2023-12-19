import Coordinate from "../../definitions/Coordinate";
import Grid from "../../definitions/Grid";
import GameSchema from "../../schemas/definitions/GameSchema";
import { willCollide } from "../../util/stateUtils";
import Cell from "../../definitions/Cell";
import ShiftDirection from "../../definitions/ShiftDirection";

export let findMaxDropDistance = (
    coordinates: Coordinate[],
    playfield: Grid<Cell>,
    playfieldSpec: GameSchema.PlayfieldSpec
): number => {
    if (coordinates.length == 0) { return 0 } 
    let dropPositions = Array.from({length: playfieldSpec.rows}, (_, i) => i + 1)
    let collisionY = dropPositions.find(n => willCollide(playfield, coordinates, 0, n))
    return Math.abs(collisionY - 1);
}

export let findMaxShiftDistance = (
    direction: ShiftDirection, 
    coordinates: Coordinate[],
    playfield: Grid<Cell>,
    playfieldSpec: GameSchema.PlayfieldSpec
): number => {
    if (coordinates.length == 0) { return 0 } 
    let shiftPositions = Array.from({length: playfieldSpec.columns}, (_, i) => i + 1)
    let collisionX = shiftPositions.find(n => willCollide(playfield, coordinates, n * direction, 0))
    return Math.abs(direction * (collisionX - 1));
}
