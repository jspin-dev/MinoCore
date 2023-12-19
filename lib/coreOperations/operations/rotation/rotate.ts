import MovementType from "../../definitions/MovementType";
import Operation from "../../definitions/CoreOperation";
import GameEvent from "../../definitions/GameEvent";
import continueInstantSoftDrop from "../drop/continueInstantSoftDrop";
import continueInstantShift from "../shift/continueInstantShift";
import Rotation from "../../definitions/Rotation";
import Cell from "../../../definitions/Cell";
import CoreDependencies from "../../definitions/CoreDependencies";
import RotationSystem from "../../../schemas/definitions/RotationSystem";
import { findMaxDropDistance, findMaxShiftDistance } from "../../utils/coreOpStateUtils";
import Orientation from "../../../definitions/Orientation";
import { gridToList } from "../../../util/sharedUtils";
import Coordinate from "../../../definitions/Coordinate";
import Outcome from "../../../definitions/Outcome";
import ShiftDirection from "../../../definitions/ShiftDirection";

export default (rotation: Rotation) => Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => Operation.Sequence(
        operations.validateRotationSettings,
        resolveRotation(rotation),
        continueInstantSoftDrop,
        continueInstantShift
    ))
)

let resolveRotation = (rotation: Rotation) => Operation.Resolve(({ state }, dependencies: CoreDependencies) => {
    let { operations, schema } = dependencies;
    let previousPlayfield = [...state.playfieldGrid.map(row => [...row])];

    let { activePiece, generatedRotationGrids, playfieldGrid } = state;
    let orientationCount = Object.keys(Orientation).length / 2;
    let newOrientation: Orientation = (rotation + activePiece.orientation + orientationCount) % orientationCount;
    let newMatrix = generatedRotationGrids[activePiece.id][newOrientation].map(it => [...it])
    let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1);
    let stateReference = {
        playfield: playfieldGrid,
        activePiece,
        generatedGrids: generatedRotationGrids
    }
    let rotationProvider = schema.rotationSystem.featureProvider
    let rotationResult = rotationProvider.rotate(stateReference, newOrientation, unadjustedCoordinates)
    switch (rotationResult.classifier) {
        case Outcome.Classifier.Failure:
            return Operation.None;
        case Outcome.Classifier.Success:
            return Operation.Sequence(
                draftRotationResult(newOrientation, unadjustedCoordinates, rotationResult.data),
                resolveDistanceCalculations, // Order matters - This relies on new state from draftRotationResult(...) 
                operations.refreshGhost.applyIf(unadjustedCoordinates != null),
                operations.updateLockStatus(MovementType.Rotate),
                Operation.Draft(({ state, events }) => { 
                    events.push(GameEvent.Rotate(rotation, previousPlayfield, state.playfieldGrid, state.activePiece)) 
                })
            )
    }
})

let resolveDistanceCalculations = Operation.Resolve(({ state }, { schema }) => {
    let { activePiece, playfieldGrid } = state;
    let maxDropDistance = findMaxDropDistance(activePiece.coordinates, playfieldGrid, schema.playfield);
    let maxLeftShiftDistance = findMaxShiftDistance(ShiftDirection.Left, activePiece.coordinates, playfieldGrid, schema.playfield);
    let maxRightShiftDistance = findMaxShiftDistance(ShiftDirection.Right, activePiece.coordinates, playfieldGrid, schema.playfield);
    return Operation.Draft(({ state }) => { 
        state.activePiece.availableDropDistance = maxDropDistance;
        state.activePiece.availableShiftDistance[ShiftDirection.Left] = maxLeftShiftDistance;
        state.activePiece.availableShiftDistance[ShiftDirection.Right] = maxRightShiftDistance;
    });
})

let draftRotationResult = (
    newOrientation: Orientation,
    unadjustedCoordinates: Coordinate[],
    offset: RotationSystem.Offset
) => {
    return Operation.Draft(({ state }) => {
        let { coordinates, location, id } = state.activePiece;
    
        if (newOrientation != undefined) {
            state.activePiece.orientation = newOrientation;
        }
        if (offset && unadjustedCoordinates) {
            coordinates.forEach(c => state.playfieldGrid[c.y][c.x] = Cell.Empty);
            coordinates.forEach((c, i) => {
                coordinates[i].x = unadjustedCoordinates[i].x + offset[0];
                coordinates[i].y = unadjustedCoordinates[i].y + offset[1];
                state.playfieldGrid[c.y][c.x] = Cell.Active(id);
            });
            location.x += offset[0];
            location.y += offset[1];
        }
    })
}

