import { gridContainsOnly } from "../util/sharedUtils";
import { Piece } from "../rotationSystems/tetraPieces";
import { ActivePiece } from "../definitions/playfieldDefinitions";
import { LockScoreAction, ScoreCalculationInfo } from "../definitions/scoring/scoringDefinitions";
import { Playfield } from "../definitions/stateTypes";
import { Grid } from "../definitions/shared/Grid";
import { Score } from "../definitions/scoring/Score";

export let getScoreAction = (lines: number, playfield: Playfield, spinSnapshot: Readonly<Grid>): LockScoreAction => {
    if (detectPC(playfield)) {
        return LockScoreAction.PC(lines);
    }
    if (spinSnapshot != null) {
        let tspinType = detectTspin(playfield.activePiece, spinSnapshot);
        switch (tspinType) {
            case LockScoreAction.Type.TSpin:
                return LockScoreAction.TSpin(lines);
            case LockScoreAction.Type.TSpinMini:
                return LockScoreAction.TSpinMini(lines);
        }
    }
    return lines > 0 ? LockScoreAction.LineClear(lines) : null;
}

export let createNewScoreStateOnLock = (
    action: LockScoreAction, 
    previousState: Score.State,
    scoreInfo: ScoreCalculationInfo
): Score.State => {
    let combo = scoreInfo.lines > 0 ? previousState.combo + 1 : -1;
    if (!action) {
        return { ...previousState, combo };
    }
    let actionInfo = LockScoreAction.defaultGuidelineScoringTable[action.key];
    let previousActionInfo = previousState.lastLockScoreAction 
        ? LockScoreAction.defaultGuidelineScoringTable[previousState.lastLockScoreAction.key] 
        : null;
    let b2b = previousActionInfo 
        && !previousActionInfo.breaksB2b 
        && previousActionInfo.difficult 
        && actionInfo.difficult;
    let b2bMultiplier = b2b ? actionInfo.b2bMultiplyer : 1;
    let comboScore = scoreInfo.comboBonusEnabled && combo > 0 ? 50 * combo * scoreInfo.level : 0;
    return {
        lastLockScoreAction: action,
        score: previousState.score + (actionInfo.basePointValue * b2bMultiplier) + comboScore,
        combo
    }
} 

let detectPC = (playfield: Playfield): boolean => {
    let grid = playfield.grid.map(row => [...row]);
    return gridContainsOnly(grid, 0);
}

let detectTspin = (activePiece: ActivePiece, spinSnapshot: Readonly<Grid>): LockScoreAction.Type => {
    if (!activePiece.activeRotation || activePiece.id != Piece.T) {
        return null;
    }
    let x = activePiece.location.x;
    let y = activePiece.location.y;
    let corners = [
        spinSnapshot[y] == undefined || spinSnapshot[y][x] != 0,
        spinSnapshot[y] == undefined || spinSnapshot[y][x + 2] != 0,
        spinSnapshot[y + 2] == undefined || spinSnapshot[y + 2][x] != 0, 
        spinSnapshot[y + 2] == undefined || spinSnapshot[y + 2][x + 2] != 0
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