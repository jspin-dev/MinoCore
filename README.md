# MinoCore

**Note: This library is still in alpha and will likely have significant changes until the first beta release**

MinoCore is a state engine for polyonmino based block-stacking games written in javascript or typescript. MinoCore consolidates the most commonly used stacking logic (managing the playfield, game statistics, piece rotation and translation, etc.) and provides a UI-agnostic interface through which to manage your game's state.

## MinoCore Lifecycle
1. An event is triggered, such as a keyboard input or timer callback
2. The game state is passed into one of MinoCore's pure functions which returns a new state
3. Additional instructions for pending side effects are executed (such as starting and stopping timers)
4. Your UI listens for the state change and updates accordingly
5. Rinse and repeat

## Operations

The majority of MinoCore logic is handled through higher order pure functions (i.e. returned values are only dependent on their inputs and do not cause side effects) called `operations`. There are two types of operations:
- `Drafters` - functions which provide new state based on their inputs. They are the 'end of the road' for all logic paths. MinoCore uses [immerjs](https://github.com/immerjs/immer) under the hood for this.
- `Resolvers` - receive a read-only copy of the state and return a different operation. The returned operation could be a Drafter, a different Resolver, or even a sequence of Drafters and Resolvers to be executed in sequential order. They cannot directly modify the state.

Operations have an execute function which performs the operation and returns a result object which includes the new state
### Core operations

| Category       | Common ops                                                                                                             | Notes                                                              |
|----------------|------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| Movement       | startShiftInput, endShiftInput, hardDrop, drop, shift, rotate, startDAS, startSoftDrop, cancelSoftDrop, startAutoShift | -                                                                  |
| Movement Misc  | continuePendingMovement, continueInstantDrop, continueInstantShift                                                     | Supporting movement ops not commonly used on their own             |
| Lifecycle      | start, initialize, refresh, prepareQueue, startInput, endInput, togglePause, recordTick                                | Top level operations (not usually returned by other ops)           |
| Supporting ops | refreshGhost, refillQueue, lock, spawn                                                                                 | Not used on their own, usually sequenced with other operations     |
| Convenience    | setPreviewQueue, setHoldPiece, setPlayfieldCell                                                                        | Useful for manual changes outside the normal lifecycle of the game |
| Other          | hold, addRns, triggerLockdown, updateSettings                                                                          | -                                                                  |

### Example operation usage

```ts
import Operation from "../../../definitions/CoreOperation"
import DropType from "../../../../definitions/DropType"
import CorePreconditions from "../../../utils/CorePreconditions"

// Combines two other operations: drop and lock
const hardDrop = Operation.Resolve(({ state }, { operations }) => Operation.Sequence(
    operations.drop(DropType.Hard, state.activePiece.availableDropDistance),
    operations.lock
))

const result = Operation.execute(hardDrop, this.state, this.dependencies)
this.state = result.state
```

## Game Schemas

A `GameSchema` is a collection of predetermined behaviors that commonly change between stacking game variants and are used by operations to modify state. You can use a preset schema, or build your own using either preset or custom behaviors.

| Behavior          | Description                                                            | Presets                                         |
|-------------------|------------------------------------------------------------------------|-------------------------------------------------|
| Playfield spec    | Playfield dimensions                                                   | Tetro default (10x20)                           |
| Piece generator   | Randomization, ordering, and queuing of upcoming pieces                | Pure random, random bag (7-bag)                 |
| Playfield reducer | Defines playfield changes when a piece is locked                       | Standard collapse (i.e. clearing lines)         |
| Lockdown system   | Ruleset for determining when and how pieces should lock                | Extended placement, Infinite placement, Classic |
| Rotation system   | Shape, spawn positions/orientations, and rotation rules for each piece | SRS, Sega, Nintendo, TGM, Custom kick table     |
| Ghost provider    | Ghost piece coordinate updates                                         | Classic, No ghost                               |

### Example schema declaration

```
{
  playfield: { columns: 10, rows: 40, ceiling: 20 },
  pieceGenerator: PieceGenerators.randomBag(5, TetroPiece.identifiers.sort()),
  playfieldReducer: PlayfieldReducers.standardCollapse,
  lockdownSystem: LockdownPresets.infinitePlacement,
  rotationSystem: srs,
  ghostProvider: GhostProviders.classic
}
```

### Preset Tetro Schemas
1. Guideline
2. Sega
3. Nintendo

## Sandbox

Explore the MinoCore Sandbox svelte app to get an idea of this library's capabilities. Just clone the repo, then run the following command from the repo's root directory `npm run dev --prefix sandbox`