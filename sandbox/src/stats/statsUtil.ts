import { getFormattedTime } from "../../../build/util/statUtil";
import { BasicStat } from "../types";
import statsTableConfig from "../config/statsConfig";
import type { Statistics } from "../../../build/types/stateTypes";

export let buildStatsSection = (statistics: Statistics) => {
    return {
        sectionName: statsTableConfig.sectionName,
        tables: statistics ? [
            buildActionTable(statistics.actionTally),
            buildBasicStatsTable(statistics)
        ] : []
    }
}

let buildActionTable = (actionTally: {[key: string]: number}): StatsEntry[] => {
    return statsTableConfig.tables.action.map(entry => {
        let value = String(actionTally[entry.value.key] || 0);
        return { ...entry, value };
    });
}

let buildBasicStatsTable = (statistics: Statistics): StatsEntry[] => {
    return  statsTableConfig.tables.basic.map(entry => {
        let entryValue = entry.value;
        let value: string;
        switch (entryValue.type) {
            case BasicStat.Classifier.FormattedTime:
                value = getFormattedTime(statistics);
                break;
            case BasicStat.Classifier.Number:
                value = String(statistics[entryValue.key].toFixed(entryValue.decimalPlaces));
                break;
            case BasicStat.Classifier.ScoreState:
                value = String(statistics.scoreState[entryValue.key] || 0)
        }
        return { ...entry, value };
    });
}

