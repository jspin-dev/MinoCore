namespace PendingMovement {

    export enum EventType {
        ShiftLeft,
        ShiftRight,
        SoftDrop
    }

}

interface PendingMovement {
    type: PendingMovement.EventType
    distance: number
}

export default PendingMovement;