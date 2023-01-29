import type { Provider, Drafter } from "../definitions/operationalDefinitions";
import type { State, Playfield } from "../definitions/stateDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { Offset, Orientation, Rotation } from "../definitions/rotationDefinitions";
import { Coordinate } from "../definitions/playfieldDefinitions";

import { refreshGhost } from "./ghost";
import { StartSoftDrop } from "./drop";
import { instantShift } from "./shift";
import { UpdateLockStatus } from "./lockdown";
import { RotationSettings } from "./settings";

import { provideIf } from "../util/providerUtils";
import { gridToList } from "../util/sharedUtils";
import { checkCollision, instantAutoShiftActive } from "../util/stateUtils";
import { LockStatusUpdateType } from "../definitions/lockdownDefinitions";

type KickInfo = {
    newOrientation: Orientation,
    matchingOffset?: Offset,
    unadjustedCoordinates?: Coordinate[]
}

export namespace Rotate {

    let draftRotation = ({ matchingOffset, unadjustedCoordinates, newOrientation }: KickInfo): Drafter => {
        return {
            requiresActiveGame: true,
            draft: draft => {
                let playfield = draft.playfield;
                let { coordinates, location, id } = playfield.activePiece;

                if (newOrientation != undefined) {
                    playfield.activePiece.orientation = newOrientation;
                }
                if (matchingOffset && unadjustedCoordinates) {
                    coordinates.forEach(c => playfield.grid[c.y][c.x] = 0);
                    coordinates.forEach((c, i) => {
                        coordinates[i].x = unadjustedCoordinates[i].x + matchingOffset[0];
                        coordinates[i].y = unadjustedCoordinates[i].y + matchingOffset[1];
                        playfield.grid[c.y][c.x] = id;
                    });
                
                    location.x += matchingOffset[0];
                    location.y += matchingOffset[1];
                }
            }
        }
    }

    let performRotation = (rotation: Rotation): Provider => {
        return {
            provide: ({ playfield, settings }) => {
                let kickInfo = getKickInfo(rotation, playfield, settings);
                if (kickInfo == null) {
                    return [];
                } else {
                    return [
                        draftRotation(kickInfo),
                        ...provideIf(kickInfo.unadjustedCoordinates != null, refreshGhost),
                        UpdateLockStatus.provider(LockStatusUpdateType.OnRotate)
                    ]
                }
            }
        }
    }

    let continueIntantSoftDropIfActive: Provider = {
        provide: state => provideIf(state.meta.instantSoftDropActive, StartSoftDrop.provider)
    }
    let continueInstantShiftIfActive = {
        provide: ({ meta, settings }: State) => {
            return provideIf(instantAutoShiftActive(meta, settings), instantShift);
        }
    }
    export let provider = (rotation: Rotation): Provider => {
        return {
            requiresActiveGame: true,
            provide: () => [
                RotationSettings.validate,
                performRotation(rotation),
                continueIntantSoftDropIfActive,
                continueInstantShiftIfActive
            ]
        }
    }

}

export let getKickInfo = (n: Rotation, playfield: Playfield, settings: Settings):KickInfo => {
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
