import React, { ReactNode } from 'react';
import styles from './Dropdown.module.scss';

type Props = {
    isExpanded: boolean;
    children: ReactNode;
}

export default function Dropdown({ isExpanded, children}: Props) {
  return (
      <div className={styles.dropdown + ` ${isExpanded ? styles.active : ""}`}>
          <div className={styles.dropdownContent}>
              {children}
          </div>
    </div>
  )
}
