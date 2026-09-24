import type { ReactNode } from "react";
import Modal from "./Modal";
import ModalForm from "./ModalForm";

type Props = {
    title: string;
    children: ReactNode;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    title,
    children,
    confirmText = "Confirm",
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal onClose={onCancel}>
            <ModalForm
                title={title}
                submitText={confirmText}
                onSubmit={(event) => {
                    event.preventDefault();
                    onConfirm();
                }}
                onCancel={onCancel}
            >
                {children}
            </ModalForm>
        </Modal>
    )
}
