export enum Lines {
    None = 0,
    Single = 1,
    Double = 2,
    Triple = 3,
    Quad = 4
}

export namespace Lines {

    export type ForClear = Lines.Single | Lines.Double | Lines.Triple | Lines.Quad
    export type ForTSpin = Lines.None | Lines.Single | Lines.Double | Lines.Triple
    export type ForTSpinMini = Lines.None | Lines.Single | Lines.Double
    export type ForPC = Lines.Single | Lines.Double | Lines.Triple | Lines.Quad

}

export type LockScoreAction = {
    type: LockScoreAction.Type,
    lines: Lines,
    key: string
}

export enum DropScoreType {
    Auto,
    Soft,
    Hard,
}

export type ScoreCalculationInfo = {
    comboBonusEnabled: boolean,
    level: number,
    lines: number
}

export namespace LockScoreAction {

    export let LineClear = (lines: Lines.ForClear): LockScoreAction => {
        return { type: Type.LineClear, lines, key: `lineClear${lines}` }
    }

    export let TSpin = (lines: Lines.ForTSpin): LockScoreAction => {
        return { type: Type.TSpin, lines, key: `tspin${lines}` }
    }

    export let TSpinMini = (lines: Lines.ForTSpinMini): LockScoreAction => {
        return { type: Type.TSpinMini, lines, key: `tspin-mini${lines}` }
    }

    export let PC = (lines: Lines.ForPC): LockScoreAction => {
        return { type: Type.PC, lines, key: `pc${lines}` }
    }

}

export namespace LockScoreAction {

    export enum Type {
        LineClear,
        TSpin,
        TSpinMini,
        PC
    }

    export type ActionInfo = {
        basePointValue: number,
        breaksB2b: boolean,
        b2bMultiplyer: number,
        difficult: boolean
    }

    export type Table = { [key: string]: ActionInfo }
 
}

export namespace LockScoreAction {

    export let defaultGuidelineScoringTable: LockScoreAction.Table = {
        [LineClear(Lines.Single).key]: { basePointValue: 100, breaksB2b: true, b2bMultiplyer: 1, difficult: false },
        [LineClear(Lines.Double).key]: { basePointValue: 300, breaksB2b: true, b2bMultiplyer: 1, difficult: false },
        [LineClear(Lines.Triple).key]: { basePointValue: 500, breaksB2b: true, b2bMultiplyer: 1, difficult: false },
        [LineClear(Lines.Quad).key]: { basePointValue: 800, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
    
        [TSpin(Lines.None).key]: { basePointValue: 400, breaksB2b: false, b2bMultiplyer: 1, difficult: false },
        [TSpin(Lines.Single).key]: { basePointValue: 800, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
        [TSpin(Lines.Double).key]: { basePointValue: 1200, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
        [TSpin(Lines.Triple).key]: { basePointValue: 1600, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
    
        [TSpinMini(Lines.None).key]: { basePointValue: 100, breaksB2b: false, b2bMultiplyer: 1, difficult: false },
        [TSpinMini(Lines.Single).key]: { basePointValue: 200, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
        [TSpinMini(Lines.Double).key]: { basePointValue: 400, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
    
        [PC(Lines.Single).key]: { basePointValue: 800, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
        [PC(Lines.Double).key]: { basePointValue: 1200, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
        [PC(Lines.Triple).key]: { basePointValue: 1800, breaksB2b: false, b2bMultiplyer: 1.5, difficult: true },
        [PC(Lines.Quad).key]: { basePointValue: 2000, breaksB2b: false, b2bMultiplyer: 1.6, difficult: true }
    }

}

export let dropScoreMultipliers = {
    [DropScoreType.Auto]: 0,
    [DropScoreType.Soft]: 1,
    [DropScoreType.Hard]: 2
}