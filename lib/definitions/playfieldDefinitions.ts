import { Orientation } from "./rotationDefinitions";

export type Coordinate = {
    x: number,
    y: number
}

export enum ShiftDirection {
    Right = 1,
    Left = -1
}

export type ActivePiece = {
    id: number,
    location: Coordinate,
    coordinates: Coordinate[],
    ghostCoordinates: Coordinate[],
    orientation: Orientation,
    activeRotation: boolean
}

