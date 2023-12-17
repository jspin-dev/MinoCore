import { gridToList } from "../../util/sharedUtils";
import MovementType from "../../definitions/MovementType";
import Operation from "../../definitions/CoreOperation";
import GameEvent from "../../definitions/GameEvent";
import continueInstantSoftDrop from "../drop/continueInstantSoftDrop";
import continueInstantShift from "../shift/continueInstantShift";
import CoreState from "../../definitions/CoreState";
import Rotation from "../../definitions/Rotation";
import Cell from "../../definitions/Cell";
import Orientation from "../../definitions/Orientation";
import GameSchema from "../../definitions/GameSchema";

export default (rotation: Rotation) => Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => Operation.Sequence(
        operations.validateRotationSettings,
        resolveRotation(rotation),
        continueInstantSoftDrop,
        continueInstantShift
    ))
)

let resolveRotation = (rotation: Rotation) => Operation.Resolve(({ state }, { operations, schema }) => {
    let previousPlayfield = [...state.playfieldGrid.map(row => [...row])];
    let kickInfo = getKickInfo(rotation, state, schema);
    if (kickInfo == null) {
        return Operation.None;
    } else {
        return Operation.Sequence(
            draftPieceKick(kickInfo),
            operations.refreshGhost.applyIf(kickInfo.unadjustedCoordinates != null),
            operations.updateLockStatus(MovementType.Rotate),
            Operation.Draft(({ state, events }) => { 
                events.push(GameEvent.Rotate(rotation, previousPlayfield, state.playfieldGrid, state.activePiece)) 
            })
        )
    }
})

let draftPieceKick = ({ matchingOffset, unadjustedCoordinates, newOrientation }: GameSchema.KickInfo) => {
    return Operation.Draft(({ state }) => {
        let { coordinates, location, id } = state.activePiece;
    
        if (newOrientation != undefined) {
            state.activePiece.orientation = newOrientation;
        }
        if (matchingOffset && unadjustedCoordinates) {
            coordinates.forEach(c => state.playfieldGrid[c.y][c.x] = Cell.Empty);
            coordinates.forEach((c, i) => {
                coordinates[i].x = unadjustedCoordinates[i].x + matchingOffset[0];
                coordinates[i].y = unadjustedCoordinates[i].y + matchingOffset[1];
                state.playfieldGrid[c.y][c.x] = Cell.Active(id);
            });
            location.x += matchingOffset[0];
            location.y += matchingOffset[1];
        }
    })
}

let getKickInfo = (n: Rotation, state: CoreState, schema: GameSchema): GameSchema.KickInfo | null => {
    let { activePiece, generatedRotationGrids } = state;
    let newOrientation: Orientation = (n + activePiece.orientation + 4) % 4; // + 4 results cocerces non-negative before mod
    let pieceDefinition = schema.pieces[activePiece.id];
    let offsetList = pieceDefinition.kickTable[activePiece.orientation][newOrientation];
    let newMatrix = generatedRotationGrids[activePiece.id][newOrientation].map(it => [...it])
    let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1);
    let matchingOffset = offsetList.find(offset => {
        return pieceDefinition.rotationValidator.isValid(state, schema, unadjustedCoordinates, offset);
    });
    if (!matchingOffset) {
        return null;
    }
    return {
        newOrientation,
        matchingOffset,
        unadjustedCoordinates
    }
}

