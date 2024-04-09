interface Log {
    level: Log.Level
    message: string
}

namespace Log {

    export enum Level {
        Debug,
        Info,
        Warning,
        Error
    }

}

export default Log