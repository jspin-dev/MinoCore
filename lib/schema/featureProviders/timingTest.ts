const calculateNextIntervalDelay = (params: { startTime: number, currentTime: number, standardDelay: number, cycleCount: number }) => {
    const { startTime, currentTime, standardDelay, cycleCount } = params
    const totalElapsedTime = currentTime - startTime
    const theoreticalElapsedTime = startTime + cycleCount * standardDelay
    const elapsedTimeDeficit = theoreticalElapsedTime - totalElapsedTime
    return standardDelay + elapsedTimeDeficit
}