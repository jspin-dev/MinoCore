import type { Drafter } from "../definitions/operationalDefinitions";
import { OperationType } from "../definitions/operationalDefinitions";

namespace CompositeDrafters {

    export namespace Makers {

        export let fulfillAddRandomNumberInstruction = (instructionId: number, numbers: number[]): Drafter => {
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

}

export default CompositeDrafters