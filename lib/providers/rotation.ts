import type { Provider, Operation } from "../definitions/operationalDefinitions";
import type { State, Playfield } from "../definitions/stateDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { Offset } from "../definitions/rotationDefinitions";
import { Rotation } from "../definitions/rotationDefinitions";

import PlayfieldDrafters from "../drafters/playfieldDrafters";
import { refreshGhostPlacement } from "./playfield";
import { StartSoftDrop } from "./drop";
import { instantShift } from "./shift";
import { UpdateLockStatus } from "./lockdown";
import { RotationSettings } from "./settings";

import { provideIf } from "../util/providerUtils";
import { gridToList } from "../util/sharedUtils";
import { checkCollision, instantAutoShiftActive } from "../util/stateUtils";
import { LockStatusUpdateType } from "../definitions/lockdownDefinitions";

export namespace Rotate {

    let performRotation = (rotation: Rotation): Provider => {
        return {
            provide: ({ playfield, settings }) => {
                let kickInfo = getKickInfo(rotation, playfield, settings);
                if (kickInfo == null) {
                    return [];
                } else {
                    return [
                        PlayfieldDrafters.Makers.rotate(kickInfo),
                        ...provideIf(kickInfo.unadjustedCoordinates != null, refreshGhostPlacement),
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

export let getKickInfo = (n: Rotation, playfield: Playfield, settings: Settings): PlayfieldDrafters.KickInfo => {
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
