# MinoCore

MinoCore is a state management and utilities library for creating block-stacking games in js and typescript. MinoCore consolidates the mostly commonly used stacking logic and provides a UI-agnostic interface through which to manage the state for your game.

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

You can test out a demo game called MinoCore Sandbox to get an idea of its capabilities. Just clone the repo, then run the following commands in your CLI from the root directory `cd sandbox` > `npm run dev`