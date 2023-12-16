import CoreState from "../definitions/CoreState";
import Grid from "../definitions/Grid";
import LockScoreAction from "../addons/guidelineStatistics/definitions/LockScoreAction";
import ActivePiece from "../definitions/ActivePiece";
import Coordinate from "../definitions/Coordinate";
import ShiftDirection from "../definitions/ShiftDirection";
import Cell from "../definitions/Cell";
import TetroPiece from "../definitions/TetroPiece";
import GameSchema from "../definitions/GameSchema";

export let shouldContinueInstantShift = (state: CoreState, playfieldSpec: GameSchema.PlayfieldSpec): boolean => {
    let { activePiece, playfieldGrid, dasRightCharged, dasLeftCharged, direction, settings } = state;
    let shouldAutoShiftRight = dasRightCharged && direction == ShiftDirection.Right;
    let shouldAutoShiftLeft = dasLeftCharged && direction == ShiftDirection.Left;
    let roomToShift = findInstantShiftDistance(direction, { activePiece, playfieldGrid, playfieldSpec }) > 0;
    return settings.arr === 0 && roomToShift && (shouldAutoShiftRight || shouldAutoShiftLeft);
}

export let shouldContinueInstantSoftDrop = (state: CoreState, playfieldSpec: GameSchema.PlayfieldSpec): boolean => {
    let { activePiece, playfieldGrid, settings, softDropActive } = state;
    return settings.softDropInterval === 0 && findInstantDropDistance({ activePiece, playfieldGrid, playfieldSpec }) > 0 && softDropActive;
}

/**
 * Determines if any member of a set of coordinates with a specified x/y offset will collide with a non-active block
 * (one that is not part of the current active piece)
 */
export let willCollide = (
    { activePiece, playfieldGrid, playfieldSpec }: CollisionPrereqisites,
    coordinates: Readonly<Coordinate[]>, 
    dx: number, 
    dy: number
) => {
    return coordinates.some(c => {
        let x = c.x + dx;
        let y = c.y + dy;
        if (x >= playfieldSpec.columns || x < 0 || y >= playfieldSpec.rows || y < 0) {
            return true;
        }
        return isBlockLocked(x, y, activePiece, playfieldGrid);
    }); 
}

export interface CollisionPrereqisites {
    activePiece: ActivePiece,
    playfieldGrid: Grid<Cell>,
    playfieldSpec: GameSchema.PlayfieldSpec
}

/**
 * Determines if a coordinate on the specified playfield contains a locked block
 */
export let isBlockLocked = (x: number, y: number, activePiece: ActivePiece, grid: Grid<Cell>) => {
    let isActiveCoordinate = activePiece.coordinates.some(c => c.x === x && c.y === y);
    let cell = grid[y][x];
    return cell.classifier == Cell.Classifier.Mino && !cell.ghost && !isActiveCoordinate; 
}

export let findInstantDropDistance = (collisionPrereqisites: CollisionPrereqisites): number => {
    let verticalCollision = false;
    let dy = 0;
    let coordinates = collisionPrereqisites.activePiece.coordinates;
    if (coordinates.length > 0) {
        while (!verticalCollision) {
            dy++;
            verticalCollision = willCollide(collisionPrereqisites, coordinates, 0, dy);
        }
    }
    return dy - 1;
}

export let findInstantShiftDistance = (
    direction: ShiftDirection, 
    collisionPrereqisites: CollisionPrereqisites
): number => {
    let activePiece = collisionPrereqisites.activePiece;
    if (activePiece.coordinates.length == 0) { return -1 } 
    if (!direction || willCollide(collisionPrereqisites, activePiece.coordinates, direction, 0)) {
        return 0;
    }
    let horizontalCollision = false;
    let dx = 0;

    while (!horizontalCollision) {
        dx += direction;
        horizontalCollision = willCollide(collisionPrereqisites, activePiece.coordinates, dx, 0);
    }
    return Math.abs(dx - direction); // Shift function expects a positive integer
}

export let onFloor = (collisionPrereqisites: CollisionPrereqisites) => findInstantDropDistance(collisionPrereqisites) == 0;

export let detectPC = (playfieldGrid: Grid<Cell>): boolean => {
    return playfieldGrid.every(row => {
        return row.every(element => element.classifier == Cell.Classifier.Empty);
    });
}

export let detectTspin = (
    activePiece: ActivePiece, 
    previousGrid: Readonly<Grid<Cell>>
): LockScoreAction.Type => {
    if (!activePiece.activeRotation || activePiece.id != TetroPiece.T) {
        return null;
    }
    let x = activePiece.location.x;
    let y = activePiece.location.y;
    let corners = [
        previousGrid[y] == undefined || previousGrid[y][x].classifier != Cell.Classifier.Empty,
        previousGrid[y] == undefined || previousGrid[y][x + 2].classifier != Cell.Classifier.Empty,
        previousGrid[y + 2] == undefined || previousGrid[y + 2][x].classifier != Cell.Classifier.Empty, 
        previousGrid[y + 2] == undefined || previousGrid[y + 2][x + 2].classifier != Cell.Classifier.Empty
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