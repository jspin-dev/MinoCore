export interface DasMechanics {
    preservationEnabled: boolean
    interruptionEnabled: boolean
    postDelayShiftEnabled: boolean
    autoShiftInterval: number // ARR in milliseconds
    delay: number // DAS in milliseconds
}

export default DasMechanics