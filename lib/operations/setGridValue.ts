import Operation from "../definitions/Operation";
import { Coordinate } from "../definitions/playfieldDefinitions";

export default (coordinate: Coordinate, value: number) => Operation.Draft( draft => {
    draft.playfield.grid[coordinate.y][coordinate.x] = value;
})