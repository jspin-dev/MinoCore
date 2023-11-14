import { Statistics } from "../types/stateTypes";

export let getFormattedTime = (statistics: Statistics): string => {
    return formatTime(statistics.time);
}

let formatTime = (time: number): string => {
    let returnStr = '';
    let hours = Math.floor(time / 3600);
    let secondsRemaining = time - hours * 3600;
    let minutes = Math.floor(secondsRemaining / 60);
    let seconds = secondsRemaining - minutes * 60;
    if (hours > 0) {
        returnStr += hours + ":";
        if (minutes < 10) {
            returnStr += "0";
        }
    }
    returnStr += minutes + ":";
    if (seconds < 10) {
        returnStr += "0";
    }
    returnStr += seconds;
    return returnStr;
}
