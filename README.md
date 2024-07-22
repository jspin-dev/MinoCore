# MinoCore

MinoCore is a state engine for polyonmino based block-stacking games written in javascript or typescript. MinoCore consolidates the most commonly used stacking logic (managing the playfield, game statistics, piece rotation and translation, etc.) and provides a UI-agnostic interface through which to manage your game's state.

## Lifecycle
1. An event is triggered, such as a keyboard input
2. Based on this event, the game state is passed into a pure function which maps the state, and returns a result
3. Deferred "side effect" actions from the result are handled, such as scheduling an additional delayed operation
4. Your UI which is not provided by MinoCore updates according to the new state
5. The game waits for the next event

## Operations

MinoCore state changes are handled through higher order pure functions called `operations`. Operations map a read-only copy of the previous state to a new state.
### Core operations

Core operations affect primary game functionality, such as the state of the playfield, active piece movement, and piece queue. There are 30+ core operations.

| Category         | Operations                                                                                                             | Notes                                                           |
|------------------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Movement         | startShiftInput, endShiftInput, hardDrop, drop, shift, rotate, startDAS, startSoftDrop, cancelSoftDrop, startAutoShift | -                                                               |
| Movement Support | completePendingMovement, continueInstantDrop, continueInstantShift                                                     | Supporting movement ops not commonly used on their own          |
| Lifecycle        | start, initialize, prepareQueue, startInput, endInput, togglePause, recordTick                                         | Top level operations which are not usually invoked by other ops |
| Other            | refreshGhost, refillQueue, lock, spawn,  hold, addRns, triggerLockdown, next, updateLockStatus, edit                   | -                                                               |


### Example operation usage

```ts
import Operation from "build/definitions/CoreOperation"
import DropType from "build/definitions/DropType"

// Creates a new 'hardDrop' operation by combining two other operations: drop and lock
const hardDrop = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => sequence(
    operations.drop(DropType.Hard, state.activePiece.availableDropDistance),
    operations.lock
))

const result = hardDrop(this.state, this.dependencies)
this.state = result.state
```

## Game Schemas

A `GameSchema` is a collection of predetermined behaviors that impact the core game state. 
Schema elements commonly change between game variants, but do not typically change during a game session. 
You can use a preset schema (such as guideline, sega, or nintendo for tetromino-based games), or build your own using preset or custom behaviors. 

Note: Statistics and scoring are not part of the schema since they are side effects and do not directly impact what happens on the playfield.

### Schema Specs
| Behavior           | Description                                                                                     | Presets                                         |
|--------------------|-------------------------------------------------------------------------------------------------|-------------------------------------------------|
| Playfield dimens   | Playfield dimensions                                                                            | Tetro default (10x20)                           |
| Piece generator    | Manages the randomization, ordering, and queuing of upcoming pieces                             | Pure random, Random bag (7-bag)                 |
| Playfield reducer  | Defines how the playfield changes after a piece locks                                           | Standard line clear (only current preset)       |
| Lockdown system    | Ruleset for determining when and how pieces should lock                                         | Extended placement, Infinite placement, Classic |
| Rotation system    | Defines the shape, spawn position, and rotation rules for each piece                            | SRS, Sega, Nintendo, TGM, Custom kick table     |
| Ghost provider     | Calculates ghost piece coordinates and corresponding new playfield after the active piece moves | Classic, No ghost                               |
| Game over detector | Determines whether the game is over after key events (on lock, spawn, and before next)          | Guideline, Lenient                              |

### Example schema declaration

```ts
const schema = {
    playfield: { columns: 10, rows: 40 },
    pieceGenerator: PieceGenerators.randomBag(5, TetroPiece.identifiers.sort()),
    playfieldReducer: PlayfieldReducers.standardLineClear,
    lockdownSystem: LockdownPresets.infinitePlacement,
    rotationSystem: RotationSystemPresets.srs,
    ghostProvider: GhostProviders.classic,
    gameOverDetector: GameOverDetectors.guideline({ ceiling: 20 })
}
```

## Settings

`Settings` can change at any time during a game session without compromising the game's integrity, using the `edit` operation.
Though `Settings` are not part of the `GameSchema`, game variants may still have typical settings associated with them. All delays are in milliseconds rather than in frames.

| Setting          | Field name                                      | Description                                                                                                                            |
|------------------|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| DAS              | `{settings}.dasMechanics.delay`                 | Auto shift delay in milliseconds [[wiki]](https://harddrop.com/wiki/DAS)                                                               |
| ARR              | `{settings}.dasMechanics.autoShiftInterval`     | Auto shift repeat rate in milliseconds [[wiki]](https://harddrop.com/wiki/DAS)                                                         |
| Post-delay shift | `{settings}.dasMechanics.postDelayShiftEnabled` | Determines whether auto shift begins immediately after the DAS delay or waits 1 auto shift cycle                                       |
| DAS preservation | `{settings}.dasMechanics.preservationEnabled`   | Determines whether DAS remains charged between pieces [[wiki]](https://harddrop.com/wiki/DAS_Optimization)                             |
| DAS interruption | `{settings}.dasMechanics.interruptionEnabled`   | Determines whether DAS effects are temporarily suspended when shifting left/right [[wiki]](https://harddrop.com/wiki/DAS_Optimization) |
| Gravity          | `{settings}.dropMechanics.autoInterval`         | Automatic drop rate in milliseconds [[wiki]](https://harddrop.com/wiki/Drop)                                                           |
| Soft drop speed  | `{settings}.dropMechanics.softInterval`         | Drop rate during soft drop in milliseconds [[wiki]](https://harddrop.com/wiki/Drop)                                                    |
| Ghost visibility | `{settings}.ghostEnabled`                       | Determines whether the ghost piece is visible [[wiki]](https://harddrop.com/wiki/Ghost_piece)                                          |

## Sandbox

Explore the MinoCore Sandbox svelte app to get an idea of this library's capabilities. Just clone the repo, then run the following command from the repo's root directory `npm run dev --prefix sandbox`