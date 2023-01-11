import { Operation, Actionable, isOperation, isOperationList } from "../definitions/operationalDefinitions";


export function provideIf(condition: boolean, actionable: Actionable): Operation[] {
    if (!condition) {
        return [];
    }
    if (isOperation(actionable)) {
        return [actionable];
    } else if (isOperationList(actionable)) {
        return actionable;
    } else {
        console.error("Unexpected actionable type ignored");
        return [];
    }
}