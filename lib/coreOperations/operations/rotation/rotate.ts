import MovementType from "../../definitions/MovementType";
import Operation from "../../definitions/CoreOperation";
import GameEvent from "../../definitions/GameEvent";
import continueInstantSoftDrop from "../drop/continueInstantSoftDrop";
import continueInstantShift from "../shift/continueInstantShift";
import Rotation from "../../definitions/Rotation";
import Cell from "../../definitions/Cell";
import CoreDependencies from "../../definitions/CoreDependencies";
import RotationSystem from "../../../schemas/definitions/RotationSystem";
import { findInstantDropDistance } from "../../utils/coreOpStateUtils";

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
    let rotationResult = schema.rotationSystem.featureProvider.rotate(rotation, state, dependencies);
    if (rotationResult == null) {
        return Operation.None;
    } else {
        return Operation.Sequence(
            draftRotationResult(rotationResult),
            resolveDistanceToFloor,
            operations.refreshGhost.applyIf(rotationResult.unadjustedCoordinates != null),
            operations.updateLockStatus(MovementType.Rotate),
            Operation.Draft(({ state, events }) => { 
                events.push(GameEvent.Rotate(rotation, previousPlayfield, state.playfieldGrid, state.activePiece)) 
            })
        )
    }
})

let resolveDistanceToFloor = Operation.Resolve(({ state }, { schema }) => {
    let distanceToFloor = findInstantDropDistance(state.activePiece.coordinates, state.playfieldGrid, schema.playfield);
    return Operation.Draft(({ state }) => { state.activePiece.distanceToFloor = distanceToFloor });
})

let draftRotationResult = ({ offset, unadjustedCoordinates, newOrientation }: RotationSystem.Result) => {
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

