import Cell from "../../definitions/Cell";
import Coordinate from "../../../definitions/Coordinate";
import Operation from "../../definitions/CoreOperation";

export default (coordinate: Coordinate, value: Cell) => Operation.Draft(({ state }) => {
    state.playfieldGrid[coordinate.y][coordinate.x] = value;
})