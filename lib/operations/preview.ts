import { Settings, Randomization } from "../definitions/settingsDefinitions";
import { GameStatus } from "../definitions/metaDefinitions";

import { spawn } from "./spawn";
import { updateStatus } from "./meta";

import { shuffle } from "../util/sharedUtils";
import { PreviewGridSettings, copyPreviewGridSettings } from "./previewGrid";
import { State } from "../types/stateTypes";
import { Grid } from "../types/sharedTypes";

export namespace Prepare {

    let clearQueue: Drafter = {
        draft: draft => { draft.preview.queue = [] }
    }
    
    let enqueueFull: Provider = {
        log: "Providing a queue based on randomization settings",
        provide: ({ settings }: State): Actionable => {
            switch(settings.randomization) {
                case Randomization.Classic:
                    return enqueueFullClassic;
                case Randomization.Bag:
                    return enqueueFullBag;
            }
        } 
    }

    let enqueueFullClassic: Provider = {
        log: "Preparing classic-randomization queue",
        provide: ({ settings }: State): Actionable => {
            let previewSize = settings.nextPreviewSize;
            let n = settings.rotationSystem[0].shapes.length;
            let queue = [];
            for (let i = 0; i < previewSize; i++) {
                queue.push(Math.floor(Math.random() *  n) + 1);
            }
            return [
                clearQueue,
                enqueue(...queue),
                syncGrid
            ];
        }
    }

    let enqueueFullBag: Provider = {
        log: "Preparing n-bag randomization queue",
        provide: ({ settings }: State): Actionable => {
            let previewSize = settings.nextPreviewSize;
            let n = settings.rotationSystem[0].shapes.length;
            let bagCount = Math.ceil(previewSize / n);
            return [
                clearQueue,
                ...[...Array(bagCount)].map(() => insertBag),
                syncGrid
            ];
        }
    }

    export let provider: Provider = {
        provide: () => [    
            clearQueue,
            enqueueFull,
            syncGrid  
        ]
    }

}

export namespace Init {

    let draftInit: Drafter = {
        draft: draft => { 
            draft.preview = {
                grid: [],
                dequeuedPiece: null,
                queue: [],
                randomNumbers: []
            }
        }
    }

    export let provider: Provider = {
        provide: ({ settings }) => {

            return performPreviewChange(
                draftInit,
                insertAddRandomNumbersInstruction(settings.rotationSystem[0].shapes.length - 1)
            );
        }
    }

}

export namespace Next {

    let dequeue: Drafter = {
        draft: draft => {
            draft.preview.dequeuedPiece = draft.preview.queue.shift();
        }
    }

    let insertClassic = {
        log: "Enqueing a random piece",
        provide: ({ preview, settings }: State): Actionable => {
            if (preview.randomNumbers.length == 0) {
                throw "Insufficient random numbers to queue a new piece";
            }
            let randomNumber = preview.randomNumbers[0];
            let numberOfPieces = settings.rotationSystem[0].shapes.length;
            let randomPiece = Math.floor(randomNumber * numberOfPieces) + 1;
            return enqueue(randomPiece);
        }
    }

    let enqueueRandomBag = {
        log: "Enqueing a random bag",
        provide: ({ settings }: State): Actionable => {
            switch(settings.randomization) {
                case Randomization.Classic:
                    return insertClassic;
                case Randomization.Bag:
                    return insertBag;
            }
        }
    }

    let provideSpawn: Provider = { 
        provide: state => spawn(state.preview.dequeuedPiece) 
    }

    export let provider: Provider = {
        provide: () => [          
            dequeue,
            enqueueRandomBag,
            syncGrid,
            provideSpawn
        ]
    }

}

export namespace RandomNumbers {

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

    export let fulfill = (instructionId: number, numbers: number[]): Drafter => {
        if (numbers.some(i => i < 0 || i >= 1)) {
            throw "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
        }
        return {
            draft: draft => {
                draft.preview.randomNumbers.push(...numbers);
                draft.meta.pendingInstructions = draft.meta.pendingInstructions.filter(instruction => {
                    instruction.id == instructionId;
                });
            }
        }
    }

}

let insertAddRandomNumbersInstruction = (quantity: number): Drafter => {
    return {
        draft: draft => { 
            draft.meta.pendingInstructions.push(
                {
                    id: ++draft.meta.lastInstructionId,
                    info:  { quantity }
                }
            ) 
        }
    }
}

let insertBag: Provider = {
    log: "Inserting a random bag of n pieces",
    provide: ({ preview, settings }: State): Actionable => {
        if (preview.queue.length >= settings.nextPreviewSize) {
            return [];
        }
        let n = settings.rotationSystem[0].shapes.length;  
        if (preview.randomNumbers.length < n-1) {
            throw "Insufficient random numbers to queue a new bag";
        }

        let randomNumbers = preview.randomNumbers.slice(1-n); // Takes the last n-1 numbers

        // [1, 2, 3, ...n]
        let unshuffled = Array.from(Array(n).keys()).map(i => i + 1);
        let shuffled = shuffle(unshuffled, randomNumbers);
        
        return [
            enqueue(...shuffled),
            RandomNumbers.remove(randomNumbers.length),
            insertAddRandomNumbersInstruction(randomNumbers.length)
        ];
    }
}

let generatePreviewGrid = (queue: readonly number[], settings: Settings): Grid => {
    let previewGridSettings = copyPreviewGridSettings(settings);

    let adjustedQueue = [ ...queue ];
    let delta = settings.nextPreviewSize - queue.length;
    if (delta > 0) {
        adjustedQueue = queue.concat(new Array(delta).fill(0));
    } else if (delta < 0) {
        adjustedQueue.splice(adjustedQueue.length + delta, -delta);
    }

    let grid: Grid = adjustedQueue
        .map(pieceId => previewGridSettings[pieceId])
        .reduce((accum, piecePreview) => {
            piecePreview.forEach(row => accum.push(row));
            return accum
        }, []);
    let bufferSpace = new Array(grid[0].length).fill(0);
    grid.push(bufferSpace);

    return grid;
}

let syncGrid: Provider = {
    log: "Syncing preview grid with the piece ids in the queue",
    provide: ({ preview, settings }: State): Actionable => {
        let grid = generatePreviewGrid(preview.queue, settings);
        return { draft: draft => { draft.preview.grid = grid } };
    }    
}

let enqueue = (...pieceIds: number[]): Drafter => {
    return {
        draft: draft => { draft.preview.queue.push(...pieceIds) }
    }
}

let performPreviewChange = (...operations: Operation[]): Operation[] => [
    PreviewGridSettings.validate,
    ...operations,
    syncGrid,
    updateStatus(GameStatus.Ready)
]