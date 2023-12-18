import GameOverCondition from "./GameOverCondition"

type GameStatus = GameStatus.GameOverType |
    typeof GameStatus.Initialized | 
    typeof GameStatus.Ready | 
    typeof GameStatus.Active | 
    typeof GameStatus.Suspended

namespace GameStatus {

    export type GameOverType =  { 
        classifier: Classifier.GameOver,
        condition: GameOverCondition
    }

    export enum Classifier {
        Initialized, // Game has been initialized but is not ready to play (ie no next queue)
        Ready, // Game is ready to be played
        Active, // Game is accepting inputs and the main timer is active
        Suspended, // Example uses: game is paused, game has "ended" but not by gameover, etc.
        GameOver, // topout, lockout, or blockout
    }

    export let Initialized = { classifier: Classifier.Initialized }

    export let Ready = { classifier: Classifier.Ready }

    export let Active = { classifier: Classifier.Active }

    export let Suspended = { classifier: Classifier.Suspended }

    export let GameOver = (condition: GameOverCondition): GameOverType => {
        return { 
            classifier: Classifier.GameOver,
            condition
        }
    }

}

export default GameStatus; 