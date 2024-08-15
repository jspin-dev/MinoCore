import type PieceIdentifier from "../../../definitions/PieceIdentifier"

// Defines GridBuilder cell
namespace GridBuilder {

    export type Cell = Cell.Types.Empty | Cell.Types.Solid

    export namespace Cell {

        export enum Classifier {
            Empty,
            Solid
        }

        export namespace Types {

            export interface Empty {
                classifier: Classifier.Empty
            }

            export interface Solid {
                classifier: Classifier.Solid,
                pieceId: PieceIdentifier
            }

        }

    }

    export namespace Cell {

        export const Empty: Cell.Types.Empty = { classifier: Classifier.Empty }

        export const Solid = (pieceId: PieceIdentifier) => {
            return { classifier: Classifier.Solid, pieceId }
        }

    }

}

// Defines GridBuilder config
namespace GridBuilder {

    export interface Config {
        spacing: number,
        margins: { vertical: number, horizontal: number },
        alignmentBias: Config.AlignmentBias,
        nextPreviewSize: number
    }

    export namespace Config {

        export namespace AlignmentBias {

            export enum Vertical { Top, Bottom }
            export enum Horizontal { Left, Right }

            export const defaults = {
                horizontal: AlignmentBias.Horizontal.Left,
                vertical: AlignmentBias.Vertical.Top
            }

        }

        export interface AlignmentBias {
            horizontal: AlignmentBias.Horizontal,
            vertical: AlignmentBias.Vertical
        }

        export const defaults = {
            spacing: 1,
            margins: { vertical: 1, horizontal: 1 },
            alignmentBias: AlignmentBias.defaults,
            nextPreviewSize: 5
        }

    }

}

export default GridBuilder