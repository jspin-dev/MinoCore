import { FormEntry, InputField } from "./forms";

export enum EditorAssociatedValue {
    PreviewQueue
}

export let editorform: FormSection[] = [
    {
        heading: "Editor Options",
        entries: [
            { 
                label: "Preview queue", 
                associatedKey: EditorAssociatedValue.PreviewQueue, 
                field: { classifier: InputField.Classifier.Text, params: {} },
                options: FormEntry.DefaultOptions
            }
        ]
    },
]
