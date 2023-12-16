enum DropScoreType {
    Auto,
    Soft,
    Hard
}

namespace DropScoreType {

    export let multipliers = {
        [DropScoreType.Auto]: 0,
        [DropScoreType.Soft]: 1,
        [DropScoreType.Hard]: 2
    }

}


export default DropScoreType