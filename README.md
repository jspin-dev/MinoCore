# MinoCore

**Note: This library is still in alpha and will likely have significant changes until the first beta release**

MinoCore is a state engine for polyonmino based block-stacking games written in javascript or typescript. MinoCore consolidates the most commonly used stacking logic (managing the playfield, game statistics, piece rotation and translation, etc.) and provides a UI-agnostic interface through which to manage your game's state.

## MinoCore Lifecycle
1. An event is triggered, such as a keyboard input or timer callback
2. The game state is passed into a pure function (aka MinoCore operation) which returns a new state
3. Additional instructions for pending side effects are executed, such as those for starting and stopping timers
4. UI updates according to the new state
5. Rinse and repeat

## Operations

The majority of MinoCore logic is handled through higher order pure functions (i.e. returned values are only dependent on their inputs and do not cause side effects) called `operations`. There are two types of operations:
- `Drafters` - functions which provide new state based on their inputs. They are the 'end of the road' for all logic paths. MinoCore uses [immerjs](https://github.com/immerjs/immer) under the hood for this.
- `Resolvers` - receive a read-only copy of the state and return a different operation. The returned operation could be a Drafter, a different Resolver, or even a sequence of Drafters and Resolvers to be executed in sequential order. Unlike Drafters, they cannot directly modify the state.

Operations have an execute function which performs the operation and returns a result object which includes the new state
### Core operations

Core operations affect primary game functionality, such as the state of the playfield, active piece, and piece queue. There are 30+ core operations.

| Category         | Operations                                                                                                             | Notes                                                    |
|------------------|------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| Movement         | startShiftInput, endShiftInput, hardDrop, drop, shift, rotate, startDAS, startSoftDrop, cancelSoftDrop, startAutoShift | -                                                        |
| Movement Support | continuePendingMovement, continueInstantDrop, continueInstantShift                                                     | Supporting movement ops not commonly used on their own   |
| Lifecycle        | start, initialize, prepareQueue, startInput, endInput, togglePause, recordTick                                         | Top level operations (not usually returned by other ops) |
| Other            | refreshGhost, refillQueue, lock, spawn,  hold, addRns, triggerLockdown, next, updateLockStatus, edit                   | -                                                        |


### Example operation usage

```ts
import Operation from "build/definitions/CoreOperation"
import DropType from "build/definitions/DropType"

// Combines two other operations: drop and lock
const hardDrop = Operation.Resolve(({ state }, { operations }) => Operation.Sequence(
    operations.drop(DropType.Hard, state.activePiece.availableDropDistance),
    operations.lock
))

const result = Operation.execute(hardDrop, this.state, this.dependencies)
this.state = result.state
```

## Game Schemas

A `GameSchema` is a collection of specifications and predetermined behaviors that impact the core game state. 
Schema elements commonly change between game variants, but do not typically change during a game session or by a user's preference. 
You can use a preset schema (such as guideline, sega, or nintendo for tetromino-based games), or build your own using preset or custom behaviors. 

Note: Statistics and scoring are not part of the schema since they are side effects and do not directly impact what happens on the playfield.

### Schema Specs
| Behavior           | Description                                                            | Presets                                         |
|--------------------|------------------------------------------------------------------------|-------------------------------------------------|
| Playfield spec     | Playfield dimensions                                                   | Tetro default (10x20)                           |
| Piece generator    | Randomization, ordering, and queuing of upcoming pieces                | Pure random, Random bag (7-bag)                 |
| Playfield reducer  | Defines how the playfield changes when a piece is locked               | Standard collapse (i.e. clearing lines)         |
| Lockdown system    | Ruleset for determining when and how pieces should lock                | Extended placement, Infinite placement, Classic |
| Rotation system    | Shape, spawn positions/orientations, and rotation rules for each piece | SRS, Sega, Nintendo, TGM, Custom kick table     |
| Ghost provider     | Ghost piece coordinate updates                                         | Classic, No ghost                               |
| Game over detector | Determines whether the game is over when pieces are locked or spawned  | Guideline, Lenient                              |

### Example schema declaration

```ts
const schema = {
    playfield: {columns: 10, rows: 40, ceiling: 20},
    pieceGenerator: PieceGenerators.randomBag(5, TetroPiece.identifiers.sort()),
    playfieldReducer: PlayfieldReducers.standardCollapse,
    lockdownSystem: LockdownPresets.infinitePlacement,
    rotationSystem: RotationSystemPresets.srs,
    ghostProvider: GhostProviders.classic,
    gameOverDetector: GameOverDetectors.guideline
}
```

## Settings

`Settings` can change at any time during a game session without compromising the game's integrity, using the `edit` operation.
Though `Settings` are not part of the `GameSchema`, game variants may still have typical settings associated with them.

| Setting          | Field name                                      | Description                                                                                                                                              |
|------------------|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| DAS              | `{settings}.dasMechanics.delay`                 | Auto shift delay in milliseconds [[wiki]](https://harddrop.com/wiki/DAS)                                                                                 |
| ARR              | `{settings}.dasMechanics.autoShiftInterval`     | Auto shift repeat rate in milliseconds [[wiki]](https://harddrop.com/wiki/DAS)                                                                           |
| Post-delay shift | `{settings}.dasMechanics.postDelayShiftEnabled` | Determines whether auto shift begins immediately after the DAS delay or waits 1 auto shift cycle [[tetr.io]](https://tetrio.team2xh.net/?t=faq#handling) |
| DAS preservation | `{settings}.dasMechanics.preservationEnabled`   | Determines whether DAS remains charged between pieces [[wiki]](https://harddrop.com/wiki/DAS_Optimization)                                               |
| DAS interruption | `{settings}.dasMechanics.interruptionEnabled`   | Determines whether DAS effects are temporarily suspended when shifting left/right [[wiki]](https://harddrop.com/wiki/DAS_Optimization)                   |
| Gravity          | `{settings}.dropMechanics.autoInterval`         | Automatic drop rate in milliseconds[[wiki]](https://harddrop.com/wiki/Drop)                                                                              |
| Soft drop speed  | `{settings}.dropMechanics.softInterval`         | Drop rate during soft drop in milliseconds[[wiki]](https://harddrop.com/wiki/Drop)                                                                       |
| Ghost visibility | `{settings}.ghostEnabled`                       | Determines whether the ghost piece is visible [[wiki]](https://harddrop.com/wiki/Ghost_piece)                                                            |

## Sandbox

Explore the MinoCore Sandbox svelte app to get an idea of this library's capabilities. Just clone the repo, then run the following command from the repo's root directory `npm run dev --prefix sandbox`