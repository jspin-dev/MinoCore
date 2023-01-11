import { State, Meta, Hold, Preview, Settings, Playfield, Grid, ActivePiece } from "../lib/types";
import { Randomization, GameStatus, Input } from "../lib/enums";
import LifecycleProviders from "../lib/providers/lifecycleProviders";
import { execute } from "../lib/exec";
import srs from "../lib/rotationSystems/srs.json";
import partialSettings from "../lib/settings.json";
import partialMeta from "./expectedInitialStates/meta.json";
import expectedPreviewGridSettings from "./expectedInitialStates/previewGridSettings.json";
import initialHoldState from "./expectedInitialStates/hold.json";
import PreviewDrafters from "../lib/drafters/previewDrafters";
import PreviewProviders from "../lib/providers/previewProviders";
import expectedPreparedPreviewState from "./expectedPreparedStates/preview.json";
import CompositeProviders from "../lib/providers/compositeProviders";
import PlayfieldProviders from "../lib/providers/playfieldProviders";

let settings: Settings = {
  ...partialSettings,
  randomization: Randomization.Bag, // TODO string -> string enum?
  rotationSystems: { srs }
}

let initialMetaState: Meta = {
  ...partialMeta,
  status: GameStatus.Ready
}

let initialSettingsState: Settings = {
  ...settings,
  rotationSystems: {
    ...settings.rotationSystems,
    srs: {
      ...settings.rotationSystems.srs,
      previewGrids: expectedPreviewGridSettings
    }
  }
}

let initialActivePiece: ActivePiece = {
  id: null,
  location: null,
  coordinates: [],
  ghostCoordinates: [],
  orientation: null,
  activeRotation: false
}

let emptyGridIsValid = (grid: Grid, rows: number, columns: number): Boolean => {
  if (grid.length != rows || grid[0].length != columns) {
    return false;
  }
  return grid.every(row => {
    return row.every(pieceId => pieceId == 0)
  });
}

describe('Testing initialization', () => {
  test('State should match expected initial properties', () => {

    /**
     * Init
     */

    let initializedState: State = execute(null, ...LifecycleProviders.Makers.init(settings));

    //Validate meta, hold, and settings states
    expect(initializedState.meta).toEqual(initialMetaState)
    expect(initializedState.hold).toEqual(initialHoldState)
    expect(initializedState.settings).toEqual(initialSettingsState)
  
    // Validate preview state
    let preview = initializedState.preview;
    let previewGrid = preview.grid.map(i => [...i]);
    let previewGridIsValid = emptyGridIsValid(previewGrid, 16, 6);
    expect(previewGridIsValid).toBe(true);
    expect(preview.dequeuedPiece).toEqual(null);
    expect(preview.randomNumbers).toEqual([]);
    expect(preview.queue).toEqual([]);

    // Validate playfield state
    let grid = initializedState.playfield.grid.map(i => [...i]);
    let playfieldGridIsValid = emptyGridIsValid(grid, settings.rows, settings.columns);
    expect(initializedState.playfield.activePiece).toEqual(initialActivePiece);
    expect(playfieldGridIsValid).toBe(true);




    /**
     * Prepare
     */

    let randomNumbers = [
      0.49583941,
      0.43857321,
      0.12398482,
      0.89348783,
      0.22294847,
      0.09394922,
      0.29993847,
    ]
    let preparedState: State = execute(
      initializedState, 
      PreviewDrafters.Makers.RandomNumbers.add(...randomNumbers),
      ...PreviewProviders.Prepare.prepareQueue
    );
    expect(preparedState.preview).toEqual(expectedPreparedPreviewState);



    /**
     * Sequenced steps
     */
    let nextState: State = execute(preparedState, ...CompositeProviders.Next.next);

    // let dropState: State = execute(nextState, ...PlayfieldProviders.drop);
    // console.log(dropState.playfield.grid)

    let shiftState: State = execute(
      nextState,
      LifecycleProviders.Makers.startInput(Input.ShiftLeft),
      ...LifecycleProviders.Makers.endInput(Input.ShiftLeft)
    );
    console.log("next")
    let shiftState2 = execute(
      shiftState,
      LifecycleProviders.Makers.startInput(Input.ShiftLeft),
      ...LifecycleProviders.Makers.endInput(Input.ShiftLeft)
    );
    console.log("next2")
    let shiftState3 = execute(
      shiftState2,
      LifecycleProviders.Makers.startInput(Input.ShiftLeft),
      ...LifecycleProviders.Makers.endInput(Input.ShiftLeft)
    );
    console.log(shiftState3.playfield.grid)
  });
});