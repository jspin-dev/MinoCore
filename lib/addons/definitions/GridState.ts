import BinaryGrid from "../../definitions/BinaryGrid";
import Cell from "../../definitions/Cell";
import Grid from "../../definitions/Grid";
import PieceIdentifier from "../../definitions/PieceIdentifier";

interface GridState {
    nextPreview: Grid<Cell>
    holdPreview: Grid<Cell>
    previewGrids: { [key: PieceIdentifier]: BinaryGrid }
}

namespace GridState {

    export let initial: GridState = {
        nextPreview: [],
        holdPreview: [],
        previewGrids: {}
    }
    
}

export default GridState