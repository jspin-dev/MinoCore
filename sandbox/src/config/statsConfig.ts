import LockScoreAction from "../../../build/addons/definitions/LockScoreAction";
import Lines from "../../../build/addons/definitions/Lines";
import { BasicStat } from "../types";

export default {
    sectionName: "Statistics",
    tables: {
        action: [
            { label: "Singles", value: LockScoreAction.LineClear(Lines.Single) },
            { label: "Doubles", value: LockScoreAction.LineClear(Lines.Double) },
            { label: "Triples", value: LockScoreAction.LineClear(Lines.Triple) },
            { label: "Quads", value: LockScoreAction.LineClear(Lines.Quad) },
        
            { label: "T-Spins", value: LockScoreAction.TSpin(Lines.None) },
            { label: "T-Spin Singles", value: LockScoreAction.TSpin(Lines.Single) },
            { label: "T-Spin Doubles", value: LockScoreAction.TSpin(Lines.Double) },
            { label: "T-Spin Triples", value: LockScoreAction.TSpin(Lines.Triple) },
        
            { label: "T-Spin Minis", value: LockScoreAction.TSpinMini(Lines.None) },
            { label: "T-Spin Mini Singles", value: LockScoreAction.TSpinMini(Lines.Single) },
            { label: "T-Spin Mini Doubles", value: LockScoreAction.TSpinMini(Lines.Double) },
        
            { label: "PC Singles", value: LockScoreAction.PC(Lines.Single) },
            { label: "PC Doubles", value: LockScoreAction.PC(Lines.Double) },
            { label: "PC Triples", value: LockScoreAction.PC(Lines.Triple) },
            { label: "PC Quads", value: LockScoreAction.PC(Lines.Quad) }
        ],
        basic: [
            { label: "Time", value: BasicStat.FormattedTime },
            { label: "Finesse", value: BasicStat.Number("finesse") },
            { label: "Lines Cleared", value: BasicStat.Number("lines") },
            { label: "KPP", value: BasicStat.Number("kpp", 2) },
            { label: "PPS", value: BasicStat.Number("pps", 2) },
            { label: "Score", value: BasicStat.ScoreState("score") },
            { label: "Combo", value: BasicStat.ScoreState("combo") },
            { label: "Keys Pressed", value: BasicStat.Number("keysPressed") },
            { label: "Pieces", value: BasicStat.Number("piecesLocked") }
        ]
    }  
}