import { Settings } from "../../definitions/settingsDefinitions";
import { Offset, Rotation } from "../../definitions/rotationDefinitions";
import { gridToList } from "../../util/sharedUtils";
import { willCollide, instantAutoShiftActive, instantSoftDropActive } from "../../util/stateUtils";
import { MovementType } from "../../definitions/inputDefinitions";
import { KickInfo, Playfield } from "../../definitions/stateTypes";
import recordRotation from "../statistics/recordRotation";
import Operation from "../../definitions/Operation";

export default (rotation: Rotation) => {
    return Operation.Provide((_, { operations }) => Operation.SequenceStrict(
        operations.validateRotationSettings,
        rotate(rotation),
        continueIntantSoftDropIfActive,
        continueInstantShiftIfActive,
        recordRotation(rotation)
    ))
}

let rotate = (rotation: Rotation) => Operation.Provide(({ state }, { operations }) => {
    let kickInfo = getKickInfo(rotation, state.playfield, state.settings);
    if (kickInfo == null) {
        return Operation.None;
    } else {
        return Operation.Sequence(
            applyKickInfo(kickInfo),
            Operation.applyIf(kickInfo.unadjustedCoordinates != null, operations.refreshGhost),
            operations.updateLockStatus(MovementType.Rotate)
        )
    }
})

let applyKickInfo = ({ matchingOffset, unadjustedCoordinates, newOrientation }: KickInfo) => {
    return Operation.DraftStrict(({ state }) => {
        let playfield = state.playfield;
        let { coordinates, location, id } = playfield.activePiece;
    
        if (newOrientation != undefined) {
            playfield.activePiece.orientation = newOrientation;
        }
        if (matchingOffset && unadjustedCoordinates) {
            playfield.activePiece.activeRotation = true;
            playfield.spinSnapshot = playfield.grid.map(row => [...row]);
            coordinates.forEach(c => playfield.grid[c.y][c.x] = 0);
            coordinates.forEach((c, i) => {
                coordinates[i].x = unadjustedCoordinates[i].x + matchingOffset[0];
                coordinates[i].y = unadjustedCoordinates[i].y + matchingOffset[1];
                playfield.grid[c.y][c.x] = id;
            });
        
            location.x += matchingOffset[0];
            location.y += matchingOffset[1];
        }
    })
}

let continueIntantSoftDropIfActive = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(instantSoftDropActive(state.meta, state.settings), operations.startSoftDrop)
})

let continueInstantShiftIfActive = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(instantAutoShiftActive(state.meta, state.settings), operations.instantShift);
})

let getKickInfo = (n: Rotation, playfield: Playfield, settings: Settings): KickInfo => {
    let { activePiece } = playfield;
    let { kickTables, rotationGrids } = settings.rotationSystem;

    let newOrientation = (n + activePiece.orientation + 4) % 4; // + 4 results cocerces non-negative before mod

    let kickTableInfo = kickTables.find(info => info.pieces.includes(activePiece.id));
    if (!kickTableInfo) {
        return { newOrientation }
    }

    let offsetList: Offset[] = kickTableInfo.tables[activePiece.orientation][newOrientation].map(it => [...it]);
    let newMatrix = rotationGrids[activePiece.id-1][newOrientation].map(it => [...it])
    let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1);
    let matchingOffset = offsetList.find(offsetPair => {
        return !willCollide(unadjustedCoordinates, offsetPair[0], offsetPair[1], playfield, settings);
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