import type { MouseEvent, ReactNode } from "react"
import styles from "./Modal.module.scss"

type Props = {
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
    function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            {children}
        </div>
    )
}
