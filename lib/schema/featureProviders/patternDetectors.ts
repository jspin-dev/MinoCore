import PatternDetector from "../definitions/PatternDetector"
import Coordinate from "../../definitions/Coordinate"
import Cell from "../../definitions/Cell"

namespace PatternDetectors {

    export let line: PatternDetector = {

        detectEliminationPattern({ playfield }): Coordinate[] {
            return playfield.flatMap((row, y) => {
                let lockedRow = row.every(cell => cell.classifier == Cell.Classifier.Locked)
                return lockedRow ? row.map((_, x) => { return { x, y }}) : []
            })
        }

    }

}

export default PatternDetectors