import type { State } from "../definitions/stateDefinitions";
import type { Provider, Actionable } from "../definitions/operationalDefinitions";

import PlayfieldDrafters from "../drafters/playfieldDrafters";

import { checkCollision } from "../util/stateUtils";

export namespace MovePiece {

    export let move = (dx: number, dy: number): Provider => {
        return {
            log: "Checking for collision and moving only if allowed",
            requiresActiveGame: true,
            provide: ({ playfield, settings }: State): Actionable => {
                let collision = checkCollision(playfield.activePiece.coordinates, dx, dy, playfield, settings);
                let shouldMovePiece = (dx !== 0 || dy !== 0) && !collision;
                return shouldMovePiece ?  PlayfieldDrafters.Makers.movePiece(dx, dy) : [];
            } 
        }
    }

}

