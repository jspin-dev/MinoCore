import CoreState from "../definitions/CoreState";
import { Statistics } from "../definitions/Statistics";
import type { ActivePiece, Coordinate } from "../definitions/playfieldDefinitions";
import { ShiftDirection } from "../definitions/playfieldDefinitions";
import { LockScoreAction } from "../definitions/scoring/scoringDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { Grid } from "../definitions/shared/Grid";
import { Playfield } from "../definitions/stateTypes";
import { Piece } from "../rotationSystems/tetraPieces";
import { gridContainsOnly } from "./sharedUtils";

export function shouldContinueInstantShift(state: CoreState): boolean {
    let { meta, settings } = state;
    let shouldAutoShiftRight = meta.dasRightCharged && meta.direction == ShiftDirection.Right;
    let shouldAutoShiftLeft = meta.dasLeftCharged && meta.direction == ShiftDirection.Left;
    return settings.arr === 0 && findInstantShiftDistance(state) > 0 && (shouldAutoShiftRight || shouldAutoShiftLeft);
}

export function shouldContinueInstantSoftDrop(state: CoreState): boolean {
    return state.settings.softDropInterval === 0 && findInstantDropDistance(state) > 0 && state.meta.softDropActive;
}

/**
 * Determines if any member of a set of coordinates with a specified x/y offset will collide with a non-active block
 * (one that is not part of the current active piece)
 */
export function willCollide(
    coordinates: Readonly<Coordinate[]>, 
    dx: number, 
    dy: number, 
    playfield: Playfield,
    settings: Settings
) {
    return coordinates.some(c => {
        let x = c.x + dx;
        let y = c.y + dy;
        if (x >= settings.columns || x < 0 || y >= settings.rows || y < 0) {
            return true;
        }
        return isBlockLocked(x, y, playfield);
    }); 
}

/**
 * Determines if a coordinate on the specified playfield contains a locked block
 */
export let isBlockLocked = (x: number, y: number, playfield: Playfield) => {
    let isActiveCoordinate = playfield.activePiece.coordinates.some(c => c.x === x && c.y === y);
    return playfield.grid[y][x] > 0 && !isActiveCoordinate; 
}

export function findInstantDropDistance({ playfield, settings }: CoreState): number {
    let verticalCollision = false;
    let dy = 0;
    let coordinates = playfield.activePiece.coordinates;
    if (coordinates.length > 0) {
        while (!verticalCollision) {
            dy++;
            verticalCollision = willCollide(coordinates, 0, dy, playfield, settings);
        }
    }
    return dy - 1;
}

export function findInstantShiftDistance({ playfield, meta, settings }: CoreState): number {
    let coordinates = playfield.activePiece.coordinates;
    if (coordinates.length == 0) { return -1 } 
    if (!meta.direction || willCollide(coordinates, meta.direction, 0, playfield, settings)) {
        return 0;
    }
    let horizontalCollision = false;
    let dx = 0;

    while (!horizontalCollision) {
        dx += meta.direction;
        horizontalCollision = willCollide(coordinates, dx, 0, playfield, settings);
    }
    return Math.abs(dx - meta.direction); // Shift function expects a positive integer
}

export let copyPreviewGridSettings = (settings: Settings): Grid[] => { 
    let previewGrids = settings.rotationSystem.previewGrids;
    if (previewGrids == null) {
        throw "Use the provider validateGridSettings before attempting to get grid settings";
    }
    return previewGrids.map(grid => {
        return grid.map(row => [...row])
    });
}

export let calculateKPP = (statistics: Statistics): number => {
    return statistics.piecesLocked ? statistics.keysPressed / statistics.piecesLocked : 0;
}

export let calculatePPS = (statistics: Statistics): number => {
    return statistics.time ? statistics.piecesLocked / statistics.time : 0;
}

export let onFloor = (state: CoreState) => findInstantDropDistance(state) == 0;

export let detectPC = (playfieldGrid: Grid): boolean => {
    return gridContainsOnly(playfieldGrid, 0);
}

export let detectTspin = (activePiece: ActivePiece, previousGrid: Readonly<Grid>): LockScoreAction.Type => {
    if (!activePiece.activeRotation || activePiece.id != Piece.T) {
        return null;
    }
    let x = activePiece.location.x;
    let y = activePiece.location.y;
    let corners = [
        previousGrid[y] == undefined || previousGrid[y][x] != 0,
        previousGrid[y] == undefined || previousGrid[y][x + 2] != 0,
        previousGrid[y + 2] == undefined || previousGrid[y + 2][x] != 0, 
        previousGrid[y + 2] == undefined || previousGrid[y + 2][x + 2] != 0
    ]
    let occupiedCornerCount = corners.reduce((sum, cornerOccupied) => cornerOccupied ? sum + 1 : sum, 0);
    // T-spin detected, still need to specify the type of t-spin
    if (occupiedCornerCount > 2) { 
        let orientation = activePiece.orientation;
        let tSpinFull = (orientation == 0 && corners[0] && corners[1]) ||
                (orientation == 1 && corners[1] && corners[3]) ||
                (orientation == 2 && corners[2] && corners[3]) ||
                (orientation == 3 && corners[0] && corners[2]);
        return tSpinFull ? LockScoreAction.Type.TSpin : LockScoreAction.Type.TSpinMini;
    }
    return null;
}