import GameSchema from "./definitions/GameSchema"
import type PieceIdentifier from "../definitions/PieceIdentifier"
import PieceSpec from "./definitions/PieceSpec"
import Orientation from "../definitions/Orientation"
import type BinaryGrid from "../definitions/BinaryGrid"
import RotationSystemBasis from "./rotation/definitions/RotationSystem"
import type Grid from "../definitions/Grid"
import RotationSystem from "./rotation/definitions/RotationSystem"
import { createEmptyGrid, gridToList } from "../util/sharedUtils"

export default (schema: GameSchema.Basis): GameSchema => {
    return {
        ...schema,
        rotationSystem: buildRotationSystem(schema.rotationSystem)
    }
}

const buildRotationSystem = (rotationSystem: RotationSystem.Basis) => {
    return {
        pieces: buildSchemaPieces(rotationSystem.pieces),
        rotate: rotationSystem.rotate
    } satisfies RotationSystem
}

const buildSchemaPieces = (pieces: PieceSpec.Basis[]) => {
    return pieces.reduce((mappedPieces, piece) => {
        mappedPieces[piece.id] = {
            id: piece.id,
            grids: generateGridSet(piece),
            startLocation: piece.startLocation,
            spawnOrientation: piece.spawnOrientation
        }
        return mappedPieces
    }, {} as Record<PieceIdentifier, PieceSpec>)
}

const generateGridSet = (spec: PieceSpec.Basis) => {
    const northGrid = [...spec.shape.map(s => [...s])]
    const eastGrid = rotateGrid(northGrid)
    const southGrid = rotateGrid(eastGrid)
    const westGrid = rotateGrid(southGrid)
    const offset = spec.offsets
    return {
        [Orientation.North]: translate(northGrid, offset[Orientation.North]),
        [Orientation.East]: translate(eastGrid, offset[Orientation.East]),
        [Orientation.South]: translate(southGrid, offset[Orientation.South]),
        [Orientation.West]: translate(westGrid, offset[Orientation.West])
    }
}

const translate = (grid: BinaryGrid, offset: RotationSystemBasis.Offset) => {
    const list = gridToList(grid, offset[0], offset[1], 1)
    const newGrid = createEmptyGrid(grid.length, grid[0].length, 0)
    list.forEach(coordinate => newGrid[coordinate.y][coordinate.x] = 1)
    return newGrid
}

const rotateGrid = <T>(matrix: Grid<T>) => {
    return matrix[0].map((_, index) => {
        return matrix.map(row => row[index]).reverse()
    }) satisfies Grid<T>
}
