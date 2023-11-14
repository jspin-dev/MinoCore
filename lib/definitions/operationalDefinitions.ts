export function isDrafter(operation: Operation): operation is Drafter {
    return "draft" in (operation as Drafter);
} 

export function isProvider(operation: Operation): operation is Provider {
    return "provide" in (operation as Provider);
} 

export function isOperation(actionable: Actionable): actionable is Operation {
    return isDrafter(actionable as Operation) || isProvider(actionable as Operation);
}  

export function isOperationList(actionable: Actionable): actionable is Operation[] {
    return Array.isArray(actionable) && actionable.every(operation => isOperation(operation));
}
