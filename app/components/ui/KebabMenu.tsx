"use client";

import { KeyboardEvent, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import Dropdown from "./Dropdown";
import styles from "./KebabMenu.module.scss";

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

// true on the client, false during SSR — the portal needs document.body
const subscribeNoop = () => () => { };
function useIsClient() {
    return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export default function KebabMenu({ items, triggerClass = "" }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<Position | null>(null);
    const isClient = useIsClient();
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuListRef = useRef<HTMLUListElement>(null);
    // Which item to focus once the menu is open: set when opened from the keyboard
    const focusOnOpenRef = useRef<"first" | "last" | null>(null);

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

        // Runs after the Dropdown dropped `inert`, so the items can take focus
        if (focusOnOpenRef.current) {
            const menuItems = getMenuItemElements();
            const item = focusOnOpenRef.current === "first" ? menuItems[0] : menuItems[menuItems.length - 1];
            item?.focus();
            focusOnOpenRef.current = null;
        }

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

        document.addEventListener("click", handleOutsideClick);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    function getMenuItemElements(): HTMLElement[] {
        return Array.from(menuListRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? []);
    }

    function closeAndFocusTrigger() {
        setIsOpen(false);
        triggerRef.current?.focus();
    }

    function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            e.stopPropagation();
            focusOnOpenRef.current = e.key === "ArrowDown" ? "first" : "last";
            setIsOpen(true);
        }
    }

    function handleMenuKeyDown(e: KeyboardEvent<HTMLUListElement>) {
        // The menu is portaled, but React events still bubble to the trigger's
        // ancestors (e.g. a clickable card header), so keep them here
        e.stopPropagation();
        const menuItems = getMenuItemElements();
        const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                menuItems[(currentIndex + 1) % menuItems.length]?.focus();
                break;
            case "ArrowUp":
                e.preventDefault();
                menuItems[currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1]?.focus();
                break;
            case "Home":
                e.preventDefault();
                menuItems[0]?.focus();
                break;
            case "End":
                e.preventDefault();
                menuItems[menuItems.length - 1]?.focus();
                break;
            case "Escape":
                e.preventDefault();
                closeAndFocusTrigger();
                break;
            case "Tab":
                // The menu lives at the end of <body>, so let focus go back to the trigger
                // instead of jumping to the page bottom
                e.preventDefault();
                closeAndFocusTrigger();
                break;
        }
    }

    return (
        <div ref={wrapRef} className={styles.wrap}>
            <button className={`${styles.trigger} ${triggerClass}`}
                ref={triggerRef}
                type="button"
                aria-label="More actions"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onKeyDown={handleTriggerKeyDown}
                onClick={(e) => {
                    e.stopPropagation();
                    // detail === 0 means the click came from Enter/Space, not a mouse
                    if (!isOpen && e.detail === 0) {
                        focusOnOpenRef.current = "first";
                    }
                    setIsOpen(prev => !prev);
                }}>
                <EllipsisVertical size={16} />
            </button>
            {isClient && createPortal(
                <div
                    ref={dropdownRef}
                    className={styles.dropdownWrapper}
                    style={position ?? { top: 0, right: 0 }}>
                    <Dropdown isExpanded={isOpen}>
                        <ul ref={menuListRef} className={styles.menu} role="menu" onKeyDown={handleMenuKeyDown}>
                            {items.map(item => (
                                <li className={styles.menuItem} key={item.label} role="none">
                                    {item.href
                                        ? <Link
                                            href={item.href}
                                            role="menuitem"
                                            className={styles.menuButton}
                                            onClick={() => setIsOpen(false)}>
                                            {item.label}
                                        </Link>
                                        : <button
                                            type="button"
                                            role="menuitem"
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
