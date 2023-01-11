import type { Grid } from "../definitions/sharedDefinitions";
import type { Meta, Playfield } from "../definitions/stateDefinitions";
import type { Coordinate } from "../definitions/playfieldDefinitions";
import type { RotationSystem } from "../definitions/rotationDefinitions";

import { ShiftDirection } from "../definitions/playfieldDefinitions";
import { Orientation } from "../definitions/rotationDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { GameStatus } from "../definitions/metaDefinitions";

export let hasGameEnded = (meta: Meta): boolean => {
    return meta.status == GameStatus.GoalComplete || 
        meta.status.classifier == GameStatus.Classifier.GameOver;
}

export function instantAutoShiftActive(meta: Meta, settings: Settings): boolean {
    let shouldAutoShiftRight = meta.dasRightCharged && meta.direction == ShiftDirection.Right;
    let shouldAutoShiftLeft = meta.dasLeftCharged && meta.direction == ShiftDirection.Left;
    return settings.arr === 0 && (shouldAutoShiftRight || shouldAutoShiftLeft);
}

export function checkCollision(
    coordinates: Readonly<Coordinate[]>, 
    dx: number, 
    dy: number, 
    playfield: Playfield,
    settings: Settings
) {
    return coordinates.some(c => {
        let x = c.x + dx;
        let y = c.y + dy;
        // Out of bounds
        if (x >= settings.columns || x < 0 || y >= settings.rows || y < 0) {
            return true;
        }
        // TODO: Should we find just the coordinates that could possibly cause a collision? Instead of this weird check
        return playfield.grid[y][x] > 0 && 
            !playfield.activePiece.coordinates.some(c => c.x === x && c.y === y); 
    }); 
}

export function findHardDropDistance(playfield: Playfield, settings: Settings): number {
    let verticalCollision = false;
    let dy = 0;
    let activePieceCoordinates = playfield.activePiece.coordinates;
    if (activePieceCoordinates.length > 0) {
        while (!verticalCollision) {
            dy++;
            verticalCollision = checkCollision(activePieceCoordinates, 0, dy, playfield, settings);
        }
    }
    return dy - 1;
}

export function getInitialOrientationGrids( rotationSystem: Readonly<RotationSystem>): Grid[] {
    return rotationSystem.rotationGrids.map(info => {
        return [...info[Orientation.North].map(it => [...it])] // copying each grid
    });
}