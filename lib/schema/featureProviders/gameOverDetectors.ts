import Cell from "../../definitions/Cell"
import GameOverDetector from "../definitions/GameOverDetector"
import GameOverCheckType from "../definitions/GameOverCheckType"

namespace GameOverDetectors {

    export const guideline = (params: { ceiling: number }) => {
        return {
            isGameOver({ checkType, coordinates, result }) {
                switch (checkType) {
                    case GameOverCheckType.BeforeSpawn:
                        return coordinates.some(c => Cell.isLocked(result.state.playfield[c.y][c.x]))
                    case GameOverCheckType.OnLock:
                        return coordinates.every(c => c.y < params.ceiling)
                    case GameOverCheckType.BeforeNext:
                        return false
                }
            }
        } satisfies GameOverDetector
    }

    export const guidelineLenient = (params: { ceiling: number }) => {
        return {
            isGameOver({ checkType, coordinates, result }) {
                const playfield = result.state.playfield
                switch (checkType) {
                    case GameOverCheckType.BeforeSpawn:
                        return coordinates.some(c => Cell.isLocked(playfield[c.y][c.x]))
                    case GameOverCheckType.OnLock:
                        return false
                    case GameOverCheckType.BeforeNext:
                        return coordinates.every(c => c.y < params.ceiling)
                            && coordinates.some(c => playfield[c.y][c.x].classifier == Cell.Classifier.Locked)
                }
            }
        } satisfies GameOverDetector
    }

}

export default GameOverDetectors
