import CoreDependencies from "../../coreOperations/definitions/CoreDependencies";
import CoreState from "../../coreOperations/definitions/CoreState";
import KickTableSchema from "../definitions/KickTableSchema";
import Orientation from "../../definitions/Orientation";
import Rotation from "../../coreOperations/definitions/Rotation";
import RotationSystem from "../definitions/RotationSystem";
import { gridToList } from "../../util/sharedUtils";
import { willCollide } from "../../util/stateUtils";

namespace RotationProviderPresets {

    export let kickTable = ({ tables, rotationValidator }: KickTableSchema): RotationSystem.FeatureProvider => {
        return {
           rotate: (
               n: Rotation, 
               state: CoreState, 
               dependencies: CoreDependencies
           ): RotationSystem.Result | null => {
               let { activePiece, generatedRotationGrids } = state;
               let newOrientation: Orientation = (n + activePiece.orientation + 4) % 4;
               let offsetList = tables[activePiece.id][activePiece.orientation][newOrientation];
               let newMatrix = generatedRotationGrids[activePiece.id][newOrientation].map(it => [...it])
               let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1);
               let matchingOffset = offsetList.find(offset => {
                   return rotationValidator.isValid(state, dependencies.schema, unadjustedCoordinates, offset);
               });
               if (!matchingOffset) {
                   return null;
               }
               return { newOrientation, offset: matchingOffset, unadjustedCoordinates }
           }
       }
   }
   
   export let classic: RotationSystem.FeatureProvider = {
       rotate: (
           n: Rotation, 
           state: CoreState, 
           dependencies: CoreDependencies
       ): RotationSystem.Result | null => {
           let { activePiece, generatedRotationGrids } = state;
           let newOrientation: Orientation = (n + activePiece.orientation + 4) % 4; 
           let newMatrix = generatedRotationGrids[activePiece.id][newOrientation].map(it => [...it])
           let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1);
           if (willCollide(state.playfieldGrid, dependencies.schema.playfield, unadjustedCoordinates, 0, 0)) {
               return null;
           }
           return { newOrientation, offset: [0, 0], unadjustedCoordinates }
       }
   }

}

export default RotationProviderPresets;