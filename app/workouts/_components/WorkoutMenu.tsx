import React, { useEffect, useRef, useState } from 'react';
import styles from "../page.module.scss";
import { EllipsisVertical } from 'lucide-react';

type Props = {
    index: number;
    openWorkoutMenuIndex: number | null;
    setOpenWorkoutMenuIndex: (index: number | null) => void
}

export default function WorkoutMenu({
    index, openWorkoutMenuIndex, setOpenWorkoutMenuIndex
}: Props) {
    const menuItems = [
        { text: "Edit", handler: edit },
        { text: "Archive", handler: archive }
    ];
    const isOpen = openWorkoutMenuIndex === index;
    const menuRef = useRef<HTMLDivElement>(null);

    function edit() {
        console.log('edit')
    }
    function archive() {
        console.log('archive');
    }

    function toggleMenu(e: React.MouseEvent) {
        e.stopPropagation();
        setOpenWorkoutMenuIndex(isOpen ? null : index);
    }

    useEffect(() => {
        if (!isOpen) return;

        function handleOutsideClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenWorkoutMenuIndex(-1);
            }
        }

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isOpen, setOpenWorkoutMenuIndex]);

    return (
        <div ref={menuRef}>
            <button className={"button-secondary " + styles.workoutMenuBtn}
                onClick={toggleMenu}>
                <span><EllipsisVertical size={16} /></span>
            </button>
            <div className={styles.workoutMenuWrap + ` ${openWorkoutMenuIndex == index ? styles.active : ""}`}>
                <div className={styles.workoutMenuWrapper}>
                    <ul className={styles.workoutMenu}>
                        {
                            menuItems.map((menuItem, i) => {
                                return (
                                    <li className={styles.workoutMenuItem}
                                        key={"workout_menu_item_" + menuItem.text}>
                                        <button role="button" key={"workout_menu_item_btn_"+menuItem.text}
                                            onClick={menuItem.handler}>
                                            {menuItem.text}
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
