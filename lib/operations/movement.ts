import { checkCollision } from "../util/stateUtils";
import { State } from "../types/stateTypes";

export namespace MovePiece {

    export let draftMove = (dx: number, dy: number): Drafter => {
        return {
            requiresActiveGame: true,
            log: "Moving piece",
            draft: draft => {
                let { activePiece, grid } = draft.playfield;

                activePiece.coordinates.forEach(c => grid[c.y][c.x] = 0);
                activePiece.location.x += dx;
                activePiece.location.y += dy;
                activePiece.coordinates = activePiece.coordinates.map(c => {
                    return { x: c.x + dx, y: c.y + dy }
                });
                activePiece.coordinates.forEach(c => grid[c.y][c.x] = activePiece.id);
                activePiece.activeRotation = false;
            }
        }
    }

    export let provider = (dx: number, dy: number): Provider => {
        return {
            log: "Checking for collision and moving only if allowed",
            requiresActiveGame: true,
            provide: ({ playfield, settings }: State): Actionable => {
                let collision = checkCollision(playfield.activePiece.coordinates, dx, dy, playfield, settings);
                let shouldMovePiece = (dx !== 0 || dy !== 0) && !collision;
                return shouldMovePiece ? draftMove(dx, dy) : [];
            } 
        }
    }

}

