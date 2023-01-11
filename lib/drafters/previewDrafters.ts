import type { Drafter } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";

namespace PreviewDrafters {

    export let init: Drafter = {
        draft: draft => { 
            draft.preview = {
                grid: [],
                dequeuedPiece: null,
                queue: [],
                randomNumbers: []
            }
        }
    }

    export let dequeue: Drafter = {
        draft: draft => {
            draft.preview.dequeuedPiece = draft.preview.queue.shift();
        }
    }

    export let clear: Drafter = {
        draft: draft => { draft.preview.queue = [] }
    }

    export namespace Makers {

        export let setGrid = (grid: Grid): Drafter => {
            return {
                log: "Setting preview grid",
                draft: draft => { draft.preview.grid = grid }
            }
        }

        export let enqueue = (...pieceIds: number[]): Drafter => {
            return {
                draft: draft => { draft.preview.queue.push(...pieceIds) }
            }
        }

        export namespace RandomNumbers {

            export let add = (...numbers: number[]): Drafter => {
                if (numbers.some(i => i < 0 || i >= 1)) {
                    throw "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
                }
                return {
                    draft: draft => { draft.preview.randomNumbers.push(...numbers) }
                }
            }   
    
            export let remove = (n: number): Drafter => {
                if (!Number.isInteger(n) || n <= 0) {
                    throw "Number of items to remove from the list must be an integer greater than 0"
                }
                return {
                    draft: draft => { 
                        let randomNumbers = draft.preview.randomNumbers;
                        randomNumbers.splice(randomNumbers.length - n, n);
                    }
                }
            }   

        }


    }

}

export default PreviewDrafters;