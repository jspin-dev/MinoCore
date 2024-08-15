import Lines from "../../definitions/Lines"

interface LockScoreAction {
    type: LockScoreAction.Type
    lines: Lines
    key: string
}

namespace LockScoreAction {

    export enum Type {
        LineClear,
        TSpin,
        TSpinMini,
        PC
    }

    export interface ActionInfo {
        basePointValue: number
        breaksB2b: boolean
        b2bMultiplyer: number
        difficult: boolean
    }

    export interface Table { 
        [key: string]: ActionInfo 
    }
 
}

// Convenience
namespace LockScoreAction {

    export const LineClear = (lines: Lines.ForClear) => {
        return { type: Type.LineClear, lines, key: `lineClear${lines}` } satisfies LockScoreAction
    }

    export const TSpin = (lines: Lines.ForTSpin) => {
        return { type: Type.TSpin, lines, key: `tspin${lines}` } satisfies LockScoreAction
    }

    export const TSpinMini = (lines: Lines.ForTSpinMini) => {
        return { type: Type.TSpinMini, lines, key: `tspin-mini${lines}` } satisfies LockScoreAction
    }

    export const PC = (lines: Lines.ForPC) => {
        return { type: Type.PC, lines, key: `pc${lines}` } satisfies LockScoreAction
    }

    export const defaultGuidelineScoringTable = {
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
    } satisfies LockScoreAction.Table

}

export default LockScoreAction