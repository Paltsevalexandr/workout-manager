import type { ReactNode, SubmitEvent } from "react"
import styles from "./ModalForm.module.scss"

type Props = {
    header?: ReactNode;
    children: ReactNode;
    className?: string;
    title?: string;
    submitText: string;
    submitDisabled?: boolean;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export default function ModalForm({
    header,
    children,
    className,
    title,
    submitText,
    submitDisabled = false,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <form className={`${styles.form} ${className ?? ""}`} onSubmit={onSubmit}>
            {
                header
                    ? header
                    : <h2>{title}</h2>
            }
            <div className={styles.formContent}>
                {children}
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="button-primary" disabled={submitDisabled}>{submitText}</button>
            </div>
        </form>
    )
}
