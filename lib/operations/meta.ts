import type { Input } from "../definitions/inputDefinitions";
import {  GameStatus } from "../definitions/metaDefinitions";
import { TimerOperation, TimerName } from "../definitions/metaDefinitions";

export let updateStatus = (status: GameStatus): Drafter => {
    return {
        draft: draft => {
            Object.assign(draft.meta, { status, previousStatus: draft.meta.status });
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

export let draftInstructionsOnStart: Operation[] = [
    updateStatus(GameStatus.Active),
    insertTimerOperation(TimerName.Clock, TimerOperation.Start),
    insertTimerOperation(TimerName.AutoDrop, TimerOperation.Start)
]

export let cancelAutoShift: Provider = {
    requiresActiveGame: true,
    provide: () => [
        insertTimerOperation(TimerName.DAS, TimerOperation.Cancel),
        insertTimerOperation(TimerName.AutoShift, TimerOperation.Cancel)
    ]
}

export let addInput = (input: Input.ActiveGame): Drafter => {
    return {
        draft: draft => { draft.meta.activeInputs.push(input) }
    }
}

export let removeInput = (input: Input.ActiveGame): Drafter => {
    return {
        draft: draft => {
            draft.meta.activeInputs = draft.meta.activeInputs.filter(i => i != input)
        }
    }
}

export let init: Drafter = {
    draft: draft => {
        draft.meta = {
            status: GameStatus.Initialized,
            previousStatus: null,
            activeInputs: [],
            softDropActive: false,
            dasRightCharged: false,
            dasLeftCharged: false,
            direction: null,
            pendingInstructions: [],
            lastInstructionId: 0
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

export let insertTimerDelayInstruction = (timerName: TimerName, delay: number): Drafter => {
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

