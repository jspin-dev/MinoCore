import LockdownStatus from "./LockdownStatus"

interface LockdownInfo {
    status: LockdownStatus
    largestY: number
}

namespace LockdownInfo {

    export let initial: LockdownInfo = {
        status: LockdownStatus.NoLockdown,
        largestY: 0
    }

}

export default LockdownInfo;