import GameEvent from "../coreOperations/definitions/GameEvent";
import Operation from "../coreOperations/definitions/CoreOperation";
import SideEffect from "../coreOperations/definitions/SideEffect";
import PieceIdentifier from "../definitions/PieceIdentifier";

namespace PresetRandomizers {

    let enqueue = (...pieces: PieceIdentifier[]) => Operation.Draft(({ state, events }) => { 
        state.previewQueue.push(...pieces);
        events.push(GameEvent.Enqueue(pieces, state.previewQueue)) ;
    })

    export namespace NBag {

        let insertBag = Operation.Resolve(({ state }, { operations, schema }) => {
            let { previewQueue, settings } = state;
            if (previewQueue.length >= settings.nextPreviewSize) {
                return Operation.None;
            }
            
            let pieces = Object.values(schema.pieces).map(def => def.id);

            if (state.randomNumbers.length < pieces.length-1) {
                throw "Insufficient random numbers to queue a new bag";
            }
        
            let randomNumbers = state.randomNumbers.slice(1-pieces.length); // Takes the last n-1 numbers
        
            // [1, 2, 3, ...n]
            let shuffled = shuffle(pieces, randomNumbers);
            
            let addRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
                sideEffectRequests.push(SideEffect.Request.Rng(randomNumbers.length))
            })
            return Operation.Sequence(
                enqueue(...shuffled),
                operations.removeRns(randomNumbers.length),
                addRnsRequest
            )
        })
    
        let enqueueFull = Operation.Resolve(({ state }, { schema }) => {
            let previewSize = state.settings.nextPreviewSize;
            let n = Object.values(schema.pieces).length;
            let bagCount = Math.ceil(previewSize / n);
            return Operation.Sequence(
                Operation.Draft(({ state }) => { state.previewQueue = [] }),
                ...[...Array(bagCount)].map(() => insertBag)
            );
        })
    
        export let operations = {
            enqueueFull,
            enqueueNext: insertBag
        }
    
    }

    export namespace Classic {

        let enqueueNext = Operation.Resolve(({ state }, { schema }) => {
            if (state.randomNumbers.length == 0) {
                throw "Insufficient random numbers to queue a new piece";
            }
            let randomNumber = state.randomNumbers[0];
            let pieces = Object.values(schema.pieces).map(def => def.id);
            let randomPiece = pieces[Math.floor(randomNumber * pieces.length)];
            return enqueue(randomPiece);
        })
    
        let enqueueFull = Operation.Resolve(({ state }, { operations, schema }) => {
            let previewSize = state.settings.nextPreviewSize;
            let pieces = Object.values(schema.pieces).map(def => def.id);
            let randomNumbers = state.randomNumbers.slice(1 - pieces.length); // Takes the last n-1 numbers
            let queue = [];
            for (let i = 0; i < previewSize; i++) {
                let rndNum = Math.floor(randomNumbers[i] * pieces.length)
                queue.push(pieces[rndNum]);
            }
            return Operation.Sequence(
                Operation.Draft(({ state }) => { state.previewQueue = [] }),
                enqueue(...queue),
                operations.removeRns(randomNumbers.length)
            );
        })
    
        export let operations = {
            enqueueFull,
            enqueueNext
        }
    
    }

}

let shuffle = <T>(
    unshuffledBag: readonly T[], 
    randomNumbers: readonly number[]
): T[] => {
    if (unshuffledBag.length != randomNumbers.length + 1) {
        throw "Bag length must be rns length + 1";
    }
    let bag = [...unshuffledBag];
    return [
        ...randomNumbers.map(randomNum => {
            var randomPieceIndex = Math.floor(randomNum * bag.length);
            return bag.splice(randomPieceIndex, 1)[0];
        }),
        bag[0]
    ]
}

export default PresetRandomizers;