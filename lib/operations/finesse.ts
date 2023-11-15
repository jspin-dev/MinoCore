import { Rotation } from "../definitions/rotationDefinitions";
import { MovementType } from "../definitions/inputDefinitions";
import finesseSettings from "../rotationSystems/finesseSettings";
import { Step, StepType } from "../definitions/steps";
import { Playfield, Statistics, StepCounts } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";

export let calculateFinesseOnLock = (playfield: Playfield, statistics: Statistics): number => {
    let coordinates = playfield.activePiece.coordinates;
    let index = coordinates.reduce((a, value) => value.x < a ? value.x : a, coordinates[0].x);
    let idealSteps = finesseSettings
        .find(set => set.pieces.includes(playfield.activePiece.id))
        .info
        .find(info => info.orientations.includes(playfield.activePiece.orientation))
        .steps[index];
    let idealStepCounts = getStepCountBreakdown(idealSteps);
    if (statistics.steps.drop > 0) { // Unable to provide finesse if the user soft drops
        return 0;
    }
    let rotationFinesse = Math.max(statistics.steps.rotate - idealStepCounts.rotate, 0);
    let shiftFinesse = Math.max(statistics.steps.shift - idealStepCounts.shift, 0);
    return rotationFinesse + shiftFinesse;
}

export let countRotation = (rotation: Rotation) => Operation.Provide(() => {
    let count = rotation == Rotation.Degrees180 ? 2 : 1;
    return countStep(MovementType.Rotate, count);
})

export let countStep = (type: MovementType, n: number = 1) => Operation.Draft(draft => { 
    draft.statistics.steps[type] += n 
})

let getStepCountBreakdown = (steps: Step[]): StepCounts => {
    let initialValues = {
        [StepType.Drop]: 0,
        [StepType.Rotate]: 0,
        [StepType.Shift]: 0,
        [StepType.Hold]: 0
    };
    return steps.reduce((values, step) => {
        return {...values, [step.type]: values[step.type] + 1 }
    }, initialValues);
}
