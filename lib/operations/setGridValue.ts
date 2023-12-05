import Operation from "../definitions/CoreOperation";
import { Coordinate } from "../definitions/playfieldDefinitions";

export default (coordinate: Coordinate, value: number) => Operation.Draft(({ state }) => {
    state.playfield.grid[coordinate.y][coordinate.x] = value;
})