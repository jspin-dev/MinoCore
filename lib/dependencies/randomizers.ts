import Operation from "../definitions/Operation";
import { SideEffectRequest } from "../definitions/metaDefinitions";
import { Dependencies } from "../definitions/stateTypes";
import { shuffle } from "../util/sharedUtils";
import removeRns from "../operations/next/removeRns";
import syncPreviewGrid from "../operations/next/syncPreviewGrid";

export namespace PresetRandomizers {

    let enqueue = (...pieceIds: number[]) => Operation.Draft(draft => { 
        draft.preview.queue.push(...pieceIds) 
    })

    export namespace NBag {

        let insertBag = Operation.Provide(({ preview, settings }) => {
            if (preview.queue.length >= settings.nextPreviewSize) {
                return Operation.None;
            }
            let n = settings.rotationSystem.shapes.length;  
            if (preview.randomNumbers.length < n-1) {
                throw "Insufficient random numbers to queue a new bag";
            }
        
            let randomNumbers = preview.randomNumbers.slice(1-n); // Takes the last n-1 numbers
        
            // [1, 2, 3, ...n]
            let unshuffled = Array.from(Array(n).keys()).map(i => i + 1);
            let shuffled = shuffle(unshuffled, randomNumbers);
            
            return Operation.Sequence(
                enqueue(...shuffled),
                removeRns(randomNumbers.length),
                Operation.Request(SideEffectRequest.Rng(randomNumbers.length))
            )
        }, {
            description: "Inserting a random bag of n pieces"
        })
    
        let enqueueFull = Operation.Provide(({ settings }) => {
            let previewSize = settings.nextPreviewSize;
            let n = settings.rotationSystem.shapes.length;
            let bagCount = Math.ceil(previewSize / n);
            return Operation.Sequence(
                Operation.Draft(draft => { draft.preview.queue = [] }),
                ...[...Array(bagCount)].map(() => insertBag),
                syncPreviewGrid
            );
        }, { 
            description: "Preparing n-bag randomization queue" 
        })
    
        export let dependencies: Dependencies.QueueRandomizer = {
            enqueueFull,
            enqueueNext: insertBag
        }
    
    }

    export namespace Classic {

        let enqueueNext = Operation.Provide(({ preview, settings }) => {
            if (preview.randomNumbers.length == 0) {
                throw "Insufficient random numbers to queue a new piece";
            }
            let randomNumber = preview.randomNumbers[0];
            let numberOfPieces = settings.rotationSystem.shapes.length;
            let randomPiece = Math.floor(randomNumber * numberOfPieces) + 1;
            return enqueue(randomPiece);
        }, {
            description: "Enqueing a random piece"
        })
    
        let enqueueFull = Operation.Provide(({ settings }) => {
            let previewSize = settings.nextPreviewSize;
            let n = settings.rotationSystem.shapes.length;
            let queue = [];
            for (let i = 0; i < previewSize; i++) {
                queue.push(Math.floor(Math.random() *  n) + 1);
            }
            return Operation.Sequence(
                Operation.Draft(draft => { draft.preview.queue = [] }),
                enqueue(...queue),
                syncPreviewGrid
            );
        }, {
            description: "Preparing classic-randomization queue",
        })
    
        export let dependencies: Dependencies.QueueRandomizer = {
            enqueueFull,
            enqueueNext
        }
    
    }

}
