import type { ReactNode, SubmitEvent } from "react"
import { X } from "lucide-react"
import styles from "./ModalForm.module.scss"

type Props = {
    children: ReactNode;
    submitText: string;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export default function ModalForm({
    children,
    submitText,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {children}
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel}>
                    <X size={16} aria-hidden="true" />
                    Cancel
                </button>
                <button type="submit">{submitText}</button>
            </div>
        </form>
    )
}
