import DasMechanics from "./DasMechanics"
import DropMechanics from "./DropMechanics"

interface Settings {
    dasMechanics: DasMechanics,
    dropMechanics: DropMechanics,
    ghostEnabled: boolean
}

namespace Settings {

    export interface Diff {
        dasMechanics?: Partial<DasMechanics>,
        dropMechanics?: Partial<DropMechanics>,
        ghostEnabled?: boolean
    }

    export const initialDefaults: Settings = {
        dasMechanics: null,
        dropMechanics: null,
        ghostEnabled: true
    }

}

export default Settings