import type { ReactNode } from "react";
import Modal from "./Modal";
import ModalForm from "./ModalForm";
import styles from "./ModalForm.module.scss"

type Props = {
    title: string;
    children: ReactNode;
    confirmText?: string;
    confirmDisabled?: boolean;
    error?: string,
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    title,
    children,
    confirmText = "Confirm",
    confirmDisabled = false,
    error = "",
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal onClose={onCancel}>
            <ModalForm
                title={title}
                submitText={confirmText}
                submitDisabled={confirmDisabled}
                onSubmit={(event) => {
                    event.preventDefault();
                    onConfirm();
                }}
                onCancel={onCancel}
            >
                {children}
                {
                    error && <p className={ styles.error }>
                        {error}
                    </p>
                }
            </ModalForm>
        </Modal>
    )
}
