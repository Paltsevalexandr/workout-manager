import type { ReactNode, SubmitEvent } from "react"
import { X } from "lucide-react"
import styles from "./ModalForm.module.scss"

type Props = {
    children: ReactNode;
    modalName: string;
    submitText: string;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export default function ModalForm({
    children,
    modalName,
    submitText,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <h2>{ modalName }</h2>
            {children}
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit">{submitText}</button>
            </div>
        </form>
    )
}
