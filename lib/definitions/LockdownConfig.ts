import LockdownReset from "./LockdownReset";

interface LockdownConfig {
    resetMethod: LockdownReset.Method
    delay: number
}

namespace LockdownConfig {

    export namespace Presets {

        export const defaultDelay = 10000;
        export const defaultMoveLimit = 15;
    
        export const ExtendedPlacement: LockdownConfig = {
            resetMethod: {
                classifier: LockdownReset.Classifier.AnyPieceMovement,
                moveLimit: defaultMoveLimit
            },
            delay: defaultDelay
        }
        
        export const InfinitePlacement: LockdownConfig = {
            resetMethod: { classifier: LockdownReset.Classifier.AnyPieceMovement },
            delay: defaultDelay
        }
    
        export const Classic: LockdownConfig = {
            resetMethod: { classifier:  LockdownReset.Classifier.MaxDropProgressionOnly },
            delay: defaultDelay
        }
        
    }

}

export default LockdownConfig;