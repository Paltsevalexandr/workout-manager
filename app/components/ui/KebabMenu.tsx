"use client";

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';
import Dropdown from './Dropdown';
import styles from './KebabMenu.module.scss';

export type MenuItem = {
    label: string;
    onClick?: () => void;
    href?: string;
};

type Props = {
    items: MenuItem[];
    triggerClass?: string;
}

type Position = {
    top?: number;
    bottom?: number;
    right: number;
};

export default function KebabMenu({ items, triggerClass }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [position, setPosition] = useState<Position | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        // calclulate position of the menu to prevent adding 
        // height to the element. Especially important, if menu added to
        // the list of cards (to each card). In this case
        // when the menu in the last item is opened it might/will
        // lead to appearing scroll (if one wasn't present before), 
        // and it looks not nice
        if (!isOpen || !wrapRef.current) return;

        const gap = 4;
        const triggerRect = wrapRef.current.getBoundingClientRect();
        const menuHeight = menuListRef.current?.getBoundingClientRect().height ?? 0;
        const right = window.innerWidth - triggerRect.right + 7;
        const fitsBelow = triggerRect.bottom + gap + menuHeight <= window.innerHeight;

        setPosition(fitsBelow
            ? { top: triggerRect.bottom + gap, right }
            : { bottom: window.innerHeight - triggerRect.top + gap, right }
        );
    }, [isOpen, items.length]);

    useEffect(() => {
        if (!isOpen) return;

        function handleOutsideClick(e: MouseEvent) {
            const target = e.target as Node;
            const insideTrigger = wrapRef.current?.contains(target);
            const insideDropdown = dropdownRef.current?.contains(target);
            if (!insideTrigger && !insideDropdown) {
                setIsOpen(false);
            }
        }
        // closes the menu instead of tracking it, since it's positioned via a
        // portal and would otherwise drift away from the trigger on scroll
        function handleScroll() {
            setIsOpen(false);
        }

        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen]);

    return (
        <div ref={wrapRef} className={styles.wrap}>
            <button className={`button-secondary ${styles.trigger} ${triggerClass}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(prev => !prev);
                }}>
                <EllipsisVertical size={16} />
            </button>
            {mounted && createPortal(
                <div
                    ref={dropdownRef}
                    className={styles.dropdownWrapper}
                    style={position ?? { top: 0, right: 0 }}>
                    <Dropdown isExpanded={isOpen}>
                        <ul ref={menuListRef} className={styles.menu}>
                            {items.map(item => (
                                <li className={styles.menuItem} key={item.label}>
                                    {item.href
                                        ? <Link
                                            href={item.href}
                                            className={styles.menuButton}
                                            onClick={() => setIsOpen(false)}>
                                            {item.label}
                                        </Link>
                                        : <button
                                            className={styles.menuButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onClick?.();
                                                setIsOpen(false);
                                            }}>
                                            {item.label}
                                        </button>
                                    }
                                </li>
                            ))}
                        </ul>
                    </Dropdown>
                </div>,
                document.body
            )}
        </div>
    )
}
