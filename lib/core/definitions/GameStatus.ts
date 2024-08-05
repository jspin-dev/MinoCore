enum GameStatus {
    Initialized = "initialized", // Game has been initialized but is not ready to play (ie no next queue)
    Ready = "ready", // Game is ready to be played
    Active = "active", // Game is accepting inputs and timers are active
    Suspended = "suspended", // Example uses: games is paused, games has "ended" but not by gameover, etc.
    GameOver = 'gameover', // topout, lockout, or blockout
}

export default GameStatus