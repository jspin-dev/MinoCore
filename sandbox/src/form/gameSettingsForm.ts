export namespace GameSettingsAssociatedKey {

    export type Any = MainType

    export enum Classifier {
        Main
    }
    
    export type MainType = {
        classifier: Classifier.Main,
        value: string
    }

    export let Main = (value: string): MainType => {
        return { classifier: Classifier.Main, value }
    }

}
