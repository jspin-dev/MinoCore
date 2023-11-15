import { checkCollision } from "../util/stateUtils";
import { State } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";

export namespace MovePiece {

    export let draftMove = (dx: number, dy: number) => Operation.Draft(draft => {
        let { activePiece, grid } = draft.playfield;

        activePiece.coordinates.forEach(c => grid[c.y][c.x] = 0);
        activePiece.location.x += dx;
        activePiece.location.y += dy;
        activePiece.coordinates = activePiece.coordinates.map(c => {
            return { x: c.x + dx, y: c.y + dy }
        });
        activePiece.coordinates.forEach(c => grid[c.y][c.x] = activePiece.id);
        activePiece.activeRotation = false;
    }, {
        description: "Moving piece",
        strict: true
    })

    export let provider = (dx: number, dy: number) => Operation.Provide(({ playfield, settings }) => {
        let collision = checkCollision(playfield.activePiece.coordinates, dx, dy, playfield, settings);
        let shouldMovePiece = (dx !== 0 || dy !== 0) && !collision;
        return shouldMovePiece ? draftMove(dx, dy) : Operation.None;
    }, {
        description: "Checking for collision and moving only if allowed",
        strict: true
    })

}

