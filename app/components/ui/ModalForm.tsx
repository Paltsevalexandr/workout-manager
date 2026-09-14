import type { ReactNode, SubmitEvent } from "react"
import styles from "./ModalForm.module.scss"

type Props = {
    header?: ReactNode;
    children: ReactNode;
    className?: string;
    modalName?: string;
    submitText: string;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export default function ModalForm({
    header,
    children,
    className,
    modalName,
    submitText,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <form className={`${styles.form} ${className ?? ""}`} onSubmit={onSubmit}>
            {
                header
                    ? header
                    : <h2>{modalName}</h2>
            }
            {children}
            <div className={styles.formActions}>
                <button type="button" className="button-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit">{submitText}</button>
            </div>
        </form>
    )
}
