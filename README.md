# MinoCore

**Note: This library is still in alpha and will likely have significant changes until the first beta release**

MinoCore is a state engine for block-stacking games written in javascript or typescript. MinoCore consolidates the most commonly used stacking logic (managing the playfield, game statistics, piece rotation and translation, etc) and provides a UI-agnostic interface through which to manage your game's state.

## MinoCore Lifecycle
1. An event is triggered, such as a keyboard input or timer callback
2. The game state is passed into a pure function which returns a new state
3. Additional instructions for pending side effects are executed (such as starting and stopping timers)
4. Your UI listens for the state change and updates accordingly
5. Rinse and repeat

## MinoCore's pure functions

The majority of MinoCore logic is handled through higher order pure functions (ie their results are only dependent on their inputs and do not cause side effects).
- Drafters - functions which provide new state based on their inputs. They are the 'end of the road' so to speak for all logic paths. MinoCore uses [immerjs](https://github.com/immerjs/immer) under the hood for this.
- Resolvers - recieve a read-only copy of the state and can return Drafters, other Resolvers, or a sequence of Drafters and Resolvers to be executed in sequential order. They do not modify the state.

## Behavior Presets

### Rotation Systems
1. SRS (Super Rotation System)
2. Sega
3. Nintendo
4. TGM (Grand Master)
5. Custom: provide your own kick table implementation

### Lockdown Systems
1. Extended placement
2. Infinite placement (move reset)
3. Classic (step reset)

### Piece Generators
1. Random - each new piece is completely independent and random
2. Random Bag (7-bag) - pieces are generated as a sequence of all pieces permuted randomly as if drawn from a bag 

## Schemas
1. Guideline
2. Sega
3. Nintendo


## Sandbox

Explore the MinoCore Sandbox svelte app to get an idea of this library's capabilities. Just clone the repo, then run the following command from the repo's root directory `npm run dev --prefix sandbox`