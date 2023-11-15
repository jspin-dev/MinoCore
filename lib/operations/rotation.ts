import { Settings } from "../definitions/settingsDefinitions";
import { Offset, Orientation, Rotation } from "../definitions/rotationDefinitions";
import { Coordinate } from "../definitions/playfieldDefinitions";

import { refreshGhost } from "./ghost";
import { StartSoftDrop } from "./drop";
import { instantShift } from "./shift";
import { UpdateLockStatus } from "./lockdown";
import { RotationSettings } from "./settings";

import { gridToList } from "../util/sharedUtils";
import { checkCollision, instantAutoShiftActive, instantSoftDropActive } from "../util/stateUtils";
import { countRotation } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { State, Playfield } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";

type KickInfo = {
    newOrientation: Orientation,
    matchingOffset?: Offset,
    unadjustedCoordinates?: Coordinate[]
}

export let rotate = (rotation: Rotation) => Operation.SequenceStrict(
    RotationSettings.validate,
    performRotation(rotation),
    continueIntantSoftDropIfActive,
    continueInstantShiftIfActive,
    countRotation(rotation)
)

let draftRotation = ({ matchingOffset, unadjustedCoordinates, newOrientation }: KickInfo): Operation.Any => {
    return Operation.DraftStrict(draft => {
        let playfield = draft.playfield;
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

let performRotation = (rotation: Rotation) => Operation.Provide(({ playfield, settings }) => {
    let kickInfo = getKickInfo(rotation, playfield, settings);
    if (kickInfo == null) {
        return Operation.None;
    } else {
        return Operation.Sequence(
            draftRotation(kickInfo),
            Operation.applyIf(kickInfo.unadjustedCoordinates != null, refreshGhost),
            UpdateLockStatus.provider(MovementType.Rotate)
        )
    }
})

let continueIntantSoftDropIfActive = Operation.Provide(({ meta, settings }) => {
    return Operation.applyIf(instantSoftDropActive(meta, settings), StartSoftDrop.provider)
})

let continueInstantShiftIfActive = Operation.Provide(({ meta, settings }) => {
    return Operation.applyIf(instantAutoShiftActive(meta, settings), instantShift);
})

let getKickInfo = (n: Rotation, playfield: Playfield, settings: Settings): KickInfo => {
    let { activePiece } = playfield;
    let { kickTables, rotationGrids } = settings.rotationSystem[0];

    let newOrientation = (n + activePiece.orientation + 4) % 4; // + 4 results cocerces non-negative before mod

    let kickTableInfo = kickTables.find(info => info.pieces.includes(activePiece.id));
    if (!kickTableInfo) {
        return { newOrientation }
    }

    let offsetList: Offset[] = kickTableInfo.tables[activePiece.orientation][newOrientation].map(it => [...it]);
    let newMatrix = rotationGrids[activePiece.id-1][newOrientation].map(it => [...it])
    let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1);
    let matchingOffset = offsetList.find(offsetPair => {
        return !checkCollision(unadjustedCoordinates, offsetPair[0], offsetPair[1], playfield, settings);
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