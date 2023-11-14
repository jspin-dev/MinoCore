export namespace Input {

    export enum ActiveGame {
        ShiftLeft = 0,
        ShiftRight = 1,
        RotateCW = 2,
        RotateCCW = 3,
        Rotate180 = 4,
        HD = 5,
        SD = 6,
        Hold = 7
    }
    
    export enum Lifecycle {
        Pause,
        Restart
    } 

    export type Any = ActiveGameInputType | LifecycleInputType

    export type ActiveGameInputType = { 
        classifier: Classifier.ActiveGameInput,
        input: ActiveGame
    }

    export type LifecycleInputType =  { 
        classifier: Classifier.Lifecycle,
        input: Lifecycle
    }

    export enum Classifier {
        ActiveGameInput,
        Lifecycle
    }

    export let makeActiveGameType = (input: ActiveGame): ActiveGameInputType => {
        return { classifier: Classifier.ActiveGameInput, input }
    }

    export let makeLifecycleType = (input: Lifecycle): LifecycleInputType => {
        return { classifier: Classifier.Lifecycle, input }
    }

    export let ShiftLeft = makeActiveGameType(ActiveGame.ShiftLeft)
    export let ShiftRight = makeActiveGameType(ActiveGame.ShiftRight)
    export let RotateCW = makeActiveGameType(ActiveGame.RotateCW)
    export let RotateCCW = makeActiveGameType(ActiveGame.RotateCCW)
    export let Rotate180 = makeActiveGameType(ActiveGame.Rotate180)
    export let HD = makeActiveGameType(ActiveGame.HD)
    export let SD = makeActiveGameType(ActiveGame.SD)
    export let Hold = makeActiveGameType(ActiveGame.Hold)

    export let Pause = makeLifecycleType(Lifecycle.Pause)
    export let Restart = makeLifecycleType(Lifecycle.Restart)

}

export enum MovementType {

    Shift = "shift",
    Drop = "drop",
    Rotate = "rotate"

}