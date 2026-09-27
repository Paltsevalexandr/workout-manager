import React from "react";
import styles from './PageTitle.module.scss';

type Props = {
    title:string
}

export default function PageTitle({title}: Props) {
    return (
        <section className={styles.pageTitleSection}>
            <div className="section-content">
                <h1 className={styles.pageTitle}>
                    {title}
                </h1>
            </div>
        </section>
    )
}
