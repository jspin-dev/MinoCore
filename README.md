# MinoCore

**Note: This library is still in alpha and will likely have have significant changes until the first beta release**

MinoCore is a state management and utilities library for creating block-stacking games in js and typescript. MinoCore consolidates the mostly commonly used stacking logic (managing the playfield, game statistics, piece rotation and translation, etc) and provides a UI-agnostic interface through which to manage your game's state.

## MinoCore Lifecycle
1. An event is triggered, such as a keyboard input or timer callback
2. The game state is passed into a pure function which returns a new state
3. Additional instructions for pending side effects are executed (such as starting and stopping timers)
4. Your UI listens for the state change and updates accordingly
5. Rinse and repeat

If you need a high level of customization, you can manage this lifecycle yourself, or you can use an out of the box ready implementation provided by this library called MinoGame (which would leave your code to handle only UI and inputs)

## MinoCore's pure functions

The majority of MinoCore logic is handled through higher order pure functions (ie their results are only dependent on their inputs and do not cause side effects).
- Drafters - functions which provide new state based on their inputs. They are the 'end of the road' so to speak for all logic paths. MinoCore uses [immerjs](https://github.com/immerjs/immer) under the hood for this.
- Providers - recieve a read-only copy of the state and can return Drafters, other Providers, or (in most cases) a list of Drafters and Providers which are to be executed in sequential order. They do not modify the state.

## Sandbox

Explore the MinoCore Sandbox svelte app to get an idea of this library's capabilities. Just clone the repo, then run the following command from the repo's root directory `npm run dev --prefix sandbox`