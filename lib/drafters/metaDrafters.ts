import type { Drafter } from "../definitions/operationalDefinitions";
import type { TimerName, TimerOperation } from "../definitions/metaDefinitions";
import { GameStatus, ActiveGameInput } from "../definitions/metaDefinitions";
import { ShiftDirection } from "../definitions/playfieldDefinitions";

namespace CompositeDrafters {

    export let unchargeDAS: Drafter = {
        draft: draft => {
            Object.assign(draft.meta, {
                dasRightCharged: false,
                dasLeftCharged: false
            });
        }
    }

    export let clearPendingInstructions: Drafter = {
        draft: draft => { draft.meta.pendingInstructions = [] }
    }

    export let init: Drafter = {
        draft: draft => {
            draft.meta = {
                status: GameStatus.Initialized,
                previousStatus: null,
                activeInputs: [],
                instantSoftDropActive: false,
                dasRightCharged: false,
                dasLeftCharged: false,
                direction: null,
                pendingInstructions: [],
                lastInstructionId: 0
            }
        }
    }

    export namespace Makers {
    
        export let addInput = (input: ActiveGameInput): Drafter => {
            return {
                draft: draft => { draft.meta.activeInputs.push(input) }
            }
        }
    
        export let removeInput = (input: ActiveGameInput): Drafter => {
            return {
                draft: draft => {
                    draft.meta.activeInputs = draft.meta.activeInputs.filter(i => i != input)
                }
            }
        }
    
        export let setDASRightCharged = (isCharged: boolean): Drafter => {
            return {
                draft: draft => { draft.meta.dasRightCharged = isCharged }
            }
        }
    
        export let setDASLeftCharged = (isCharged: boolean): Drafter => {
            return {
                draft: draft => { draft.meta.dasLeftCharged = isCharged }
            }
        }

        export let setDirection = (direction: ShiftDirection): Drafter => {
            return {
                draft: draft => { draft.meta.direction = direction }
            }
        }

        export let setInstantSoftDropActive = (isActive: boolean): Drafter => {
            return {
                draft: draft => { draft.meta.instantSoftDropActive = isActive }
            }
        }

        export let updateStatus = (status: GameStatus.Any): Drafter => {
            return {
                draft: draft => {
                    draft.meta.previousStatus = draft.meta.status;
                    draft.meta.status = status;
                    //Object.assign(draft.meta, { status, previousStatus: draft.meta.status });
                }
            }
        }

        export let insertTimerOperation = (timerName: TimerName, operation: TimerOperation): Drafter => {
            return {
                draft: draft => { 
                    draft.meta.pendingInstructions.push(
                        {
                            id: ++draft.meta.lastInstructionId,
                            info: { timerName, operation }
                        }
                    ) 
                }
            }
        }

        export let insertGlobalTimerOperation = (operation: TimerOperation): Drafter => {
            return {
                draft: draft => { 
                    draft.meta.pendingInstructions.push(
                        {
                            id: ++draft.meta.lastInstructionId,
                            info: { operation }
                        }
                    ) 
                }
            }
        }

        export let insertTimerDelayChange = (timerName: TimerName, delay: number): Drafter => {
            return {
                draft: draft => { 
                    draft.meta.pendingInstructions.push(
                        {
                            id: ++draft.meta.lastInstructionId,
                            info:  { timerName, delay }
                        }
                    ) 
                }
            }
        }

        export let insertAddRandomNumbersInstruction = (quantity: number): Drafter => {
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

        export let fulfillTimerInstruction = (instructionId: number): Drafter => {
            return {
                draft: draft => {
                    draft.meta.pendingInstructions = draft.meta.pendingInstructions.filter(instruction => {
                        instruction.id == instructionId;
                    })
                 }
            }
        }

    }
    
}

export default CompositeDrafters;