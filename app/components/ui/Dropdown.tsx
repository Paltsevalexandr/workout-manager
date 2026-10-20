import { ReactNode } from "react";
import styles from "./Dropdown.module.scss";

type Props = {
    isExpanded: boolean;
    children: ReactNode;
}

export default function Dropdown({ isExpanded, children}: Props) {
  return (
      // inert keeps collapsed content out of Tab order and screen readers,
      // overflow: hidden only hides it visually
      <div className={styles.dropdown + ` ${isExpanded ? styles.active : ""}`} inert={!isExpanded}>
          <div className={styles.dropdownContent}>
              {children}
          </div>
    </div>
  )
}
