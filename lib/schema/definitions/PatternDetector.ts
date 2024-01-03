import Playfield from "../../definitions/Playfield"
import Coordinate from "../../definitions/Coordinate"
import ActivePiece from "../../definitions/ActivePiece"

interface PatternDetector {

    detectEliminationPattern: (params: { playfield: Playfield, activePiece: ActivePiece }) => Coordinate[]

}

export default PatternDetector