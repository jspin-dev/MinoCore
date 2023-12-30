enum Lines {
    None = 0,
    Single = 1,
    Double = 2,
    Triple = 3,
    Quad = 4
}

namespace Lines {

    export type ForClear = Lines.Single | Lines.Double | Lines.Triple | Lines.Quad
    export type ForTSpin = Lines.None | Lines.Single | Lines.Double | Lines.Triple
    export type ForTSpinMini = Lines.None | Lines.Single | Lines.Double
    export type ForPC = Lines.Single | Lines.Double | Lines.Triple | Lines.Quad

}

export default Lines
