import GameEvent from "../definitions/GameEvent";
import Operation from "../definitions/CoreOperation";
import { SideEffectRequest } from "../definitions/metaDefinitions";
import { shuffle } from "../util/sharedUtils";

export namespace PresetRandomizers {

    let enqueue = (...pieceIds: number[]) => Operation.Draft(({ state, events }) => { 
        state.preview.queue.push(...pieceIds);
        events.push(GameEvent.Enqueue(pieceIds, state.preview.queue)) ;
    })

    export namespace NBag {

        let insertBag = Operation.Provide(({ state }, { operations }) => {
            let { preview, settings } = state;
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
            
            let addRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
                sideEffectRequests.push(SideEffectRequest.Rng(randomNumbers.length))
            })
            return Operation.Sequence(
                enqueue(...shuffled),
                operations.removeRns(randomNumbers.length),
                addRnsRequest
            )
        }, {
            description: "Inserting a random bag of n pieces"
        })
    
        let enqueueFull = Operation.Provide(({ state }, { operations }) => {
            let previewSize = state.settings.nextPreviewSize;
            let n = state.settings.rotationSystem.shapes.length;
            let bagCount = Math.ceil(previewSize / n);
            return Operation.Sequence(
                Operation.Draft(({ state }) => { state.preview.queue = [] }),
                ...[...Array(bagCount)].map(() => insertBag),
                operations.syncPreviewGrid
            );
        }, { 
            description: "Preparing n-bag randomization queue" 
        })
    
        export let operations = {
            enqueueFull,
            enqueueNext: insertBag
        }
    
    }

    export namespace Classic {

        let enqueueNext = Operation.Provide(({ state }) => {
            if (state.preview.randomNumbers.length == 0) {
                throw "Insufficient random numbers to queue a new piece";
            }
            let randomNumber = state.preview.randomNumbers[0];
            let numberOfPieces = state.settings.rotationSystem.shapes.length;
            let randomPiece = Math.floor(randomNumber * numberOfPieces) + 1;
            return enqueue(randomPiece);
        }, {
            description: "Enqueing a random piece"
        })
    
        let enqueueFull = Operation.Provide(({ state }, { operations }) => {
            let previewSize = state.settings.nextPreviewSize;
            let n = state.settings.rotationSystem.shapes.length;
            let queue = [];
            for (let i = 0; i < previewSize; i++) {
                queue.push(Math.floor(Math.random() *  n) + 1);
            }
            return Operation.Sequence(
                Operation.Draft(({ state }) => { state.preview.queue = [] }),
                enqueue(...queue),
                operations.syncPreviewGrid
            );
        }, {
            description: "Preparing classic-randomization queue",
        })
    
        export let operations = {
            enqueueFull,
            enqueueNext
        }
    
    }

}
