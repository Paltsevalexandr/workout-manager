import { useEffect, useEffectEvent, type MouseEvent, type ReactNode } from "react"
import styles from "./Modal.module.scss"

type Props = {
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
    const onEscape = useEffectEvent(onClose);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            // A nested control (e.g. an open dropdown) handles Escape itself
            // and marks it with preventDefault, so only it closes
            if (event.key !== "Escape" || event.defaultPrevented) return;
            onEscape();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

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
