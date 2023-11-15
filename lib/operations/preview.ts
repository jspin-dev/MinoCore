import { Settings, Randomization } from "../definitions/settingsDefinitions";
import { GameStatus } from "../definitions/metaDefinitions";

import { spawn } from "./spawn";
import { updateStatus } from "./meta";

import { shuffle } from "../util/sharedUtils";
import { PreviewGridSettings, copyPreviewGridSettings } from "./previewGrid";
import { State } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";
import { Grid } from "../definitions/shared/Grid";

let syncGrid = Operation.Provide(({ preview, settings }: State) => {
    let grid = generatePreviewGrid(preview.queue, settings);
    return Operation.Draft(draft => { draft.preview.grid = grid });    
}, {
    description: "Syncing preview grid with the piece ids in the queue"
})

export namespace Prepare {

    let clearQueue = Operation.Draft(draft => { draft.preview.queue = [] })
    
    let enqueueFull = Operation.Provide(({ settings }): Operation.Any => {
        switch(settings.randomization) {
            case Randomization.Classic:
                return enqueueFullClassic;
            case Randomization.Bag:
                return enqueueFullBag;
        }
    }, {
        description: "Providing a queue based on randomization settings"
    })

    let enqueueFullClassic = Operation.Provide(({ settings }) => {
        let previewSize = settings.nextPreviewSize;
        let n = settings.rotationSystem[0].shapes.length;
        let queue = [];
        for (let i = 0; i < previewSize; i++) {
            queue.push(Math.floor(Math.random() *  n) + 1);
        }
        return Operation.Sequence(
            clearQueue,
            enqueue(...queue),
            syncGrid
        );
    }, {
        description: "Preparing classic-randomization queue",
    })

    let enqueueFullBag = Operation.Provide(({ settings }) => {
            let previewSize = settings.nextPreviewSize;
            let n = settings.rotationSystem[0].shapes.length;
            let bagCount = Math.ceil(previewSize / n);
            return Operation.Sequence(
                clearQueue,
                ...[...Array(bagCount)].map(() => insertBag),
                syncGrid
            );
    }, { 
        description: "Preparing n-bag randomization queue" 
    })

    export let provider = Operation.Sequence(    
        clearQueue,
        enqueueFull,
        syncGrid  
    )

}

export namespace Init {

    let draftInit = Operation.Draft(draft => {
        draft.preview = {
            grid: [],
            dequeuedPiece: null,
            queue: [],
            randomNumbers: []
        }
    })

    export let provider = Operation.Provide(({ settings }) => performPreviewChange(
        Operation.Sequence(
            draftInit,
            insertAddRandomNumbersInstruction(settings.rotationSystem[0].shapes.length - 1)
        )
    ));

}

export namespace Next {

    let dequeue = Operation.Draft(draft => { 
        draft.preview.dequeuedPiece = draft.preview.queue.shift(); 
    })

    let insertClassic = Operation.Provide(({ preview, settings }) => {
        if (preview.randomNumbers.length == 0) {
            throw "Insufficient random numbers to queue a new piece";
        }
        let randomNumber = preview.randomNumbers[0];
        let numberOfPieces = settings.rotationSystem[0].shapes.length;
        let randomPiece = Math.floor(randomNumber * numberOfPieces) + 1;
        return enqueue(randomPiece);
    }, {
        description: "Enqueing a random piece"
    })

    let enqueueRandomBag = Operation.Provide(({ settings }) => {
        switch(settings.randomization) {
            case Randomization.Classic:
                return insertClassic;
            case Randomization.Bag:
                return insertBag;
        }
    }, {
        description: "Enqueing a random bag"
    })

    let provideSpawn = Operation.Provide(state => spawn(state.preview.dequeuedPiece))

    export let provider = Operation.Sequence(            
        dequeue,
        enqueueRandomBag,
        syncGrid,
        provideSpawn
    )

}

export namespace RandomNumbers {

    export let remove = (n: number): Operation.Any => {
        if (!Number.isInteger(n) || n <= 0) {
            throw "Number of items to remove from the list must be an integer greater than 0"
        }
        return Operation.Draft(draft => { 
            let randomNumbers = draft.preview.randomNumbers;
            randomNumbers.splice(randomNumbers.length - n, n);
        })
    }   

    export let fulfill = (instructionId: number, numbers: number[]): Operation.Any => {
        if (numbers.some(i => i < 0 || i >= 1)) {
            throw "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
        }
        return Operation.Draft(draft => {
            draft.preview.randomNumbers.push(...numbers);
            draft.meta.pendingInstructions = draft.meta.pendingInstructions.filter(instruction => {
                instruction.id == instructionId;
            });
        })
    }

}

let insertAddRandomNumbersInstruction = (quantity: number) => Operation.Draft(draft => {
    draft.meta.pendingInstructions.push(
        {
            id: ++draft.meta.lastInstructionId,
            info:  { quantity }
        }
    ) 
})



let insertBag = Operation.Provide(({ preview, settings }) => {
    if (preview.queue.length >= settings.nextPreviewSize) {
        return Operation.None;
    }
    let n = settings.rotationSystem[0].shapes.length;  
    if (preview.randomNumbers.length < n-1) {
        throw "Insufficient random numbers to queue a new bag";
    }

    let randomNumbers = preview.randomNumbers.slice(1-n); // Takes the last n-1 numbers

    // [1, 2, 3, ...n]
    let unshuffled = Array.from(Array(n).keys()).map(i => i + 1);
    let shuffled = shuffle(unshuffled, randomNumbers);
    
    return Operation.Sequence(
        enqueue(...shuffled),
        RandomNumbers.remove(randomNumbers.length),
        insertAddRandomNumbersInstruction(randomNumbers.length)
    )
}, {
    description: "Inserting a random bag of n pieces"
})

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

let enqueue = (...pieceIds: number[]) => Operation.Draft(draft => { 
    draft.preview.queue.push(...pieceIds) 
})

let performPreviewChange = (operation: Operation.Any) => Operation.Sequence(
    PreviewGridSettings.validate,
    operation,
    syncGrid,
    updateStatus(GameStatus.Ready)
)