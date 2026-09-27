"use client";

import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from "./SearchableMultiSelect.module.scss";
import { capitalize } from '@/lib';


type Props<T extends { name: string, id: number }> = {
    items: T[];
    name: string;
    label: string;
    selectedItems: T[];
    queryMinLength?: number;
    error?: string;
    setSelectedItems: Dispatch<SetStateAction<T[]>>
}

type Position = {
    top: number;
    left: number;
    width: number;
};

export default function SearchableMultiSelect<T extends { name: string, id: number }>({
    items,
    name,
    label,
    selectedItems,
    queryMinLength = 1,
    error,
    setSelectedItems

}: Props<T>) {
    const [query, setQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [position, setPosition] = useState<Position | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fieldRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!isDropdownOpen || !fieldRef.current) return;

        const gap = 1;
        const rect = fieldRef.current.getBoundingClientRect();
        const inset = rect.width * 0.015;
        setPosition({
            top: rect.bottom + gap,
            left: rect.left + inset,
            width: rect.width - inset * 2
        });
    }, [isDropdownOpen, selectedItems]);

    useEffect(() => {
        if (!isDropdownOpen) return;

        function handleOutsideClick(e: MouseEvent) {
            const target = e.target as Node;
            const insideField = containerRef.current?.contains(target);
            const insideDropdown = dropdownRef.current?.contains(target);
            if (!insideField && !insideDropdown) {
                setIsDropdownOpen(false);
            }
        }
        function handleScroll() {
            setIsDropdownOpen(false);
        }

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isDropdownOpen]);

    function deleteItem(item: T) {
        setSelectedItems(prev => prev.filter(prevItem => prevItem.id != item.id));
    }

    function handleSelectItem(item: T) {
        setSelectedItems(prev => [...prev, item]);
        setQuery("");
        inputRef.current?.focus();
    }

    let filteredItems: T[] = [];
    let hasMatches = false;
    const matches = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
    hasMatches = matches.length > 0;
    filteredItems = matches.filter(item =>
        !selectedItems.find(selectedItem => selectedItem.id == item.id)
    );

    const showDropdown = isDropdownOpen && query.length >= queryMinLength;

    return (
        <div ref={containerRef}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <div ref={fieldRef} className={styles.multiSelect}>
                {
                    selectedItems.map(item => (
                        <span className={styles.selectedItem} key={name + "_selected_" + item.id}>
                            {capitalize(item.name)}
                            <button
                                className={styles.selectedItemDelete}
                                type="button"
                                aria-label={`Remove ${item.name}`}
                                onClick={() => deleteItem(item)}
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))
                }
                <input
                    ref={inputRef}
                    id={name}
                    name={name}
                    className={styles.multiSelectInput}
                    value={query}
                    autoComplete="off"
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={"Search..."}
                />
            </div>
            {
                mounted && showDropdown && position && createPortal(
                    <ul
                        ref={dropdownRef}
                        className={styles.foundItems}
                        style={{ top: position.top, left: position.left, width: position.width }}>
                        {
                            filteredItems.map(item => {
                                return (
                                    <li key={name + "_filtered_" + item.id}
                                        className={styles.foundItem}>
                                        <button type="button"
                                            onClick={() => handleSelectItem(item)}>
                                            {capitalize(item.name)}
                                        </button>
                                    </li>
                                )
                            })
                        }
                        {
                            !filteredItems.length && query.length >= queryMinLength && (
                                hasMatches
                                    ? <li className={styles.foundItemEmpty}>All matches already added</li>
                                    : <li className={styles.foundItemEmpty}>Not Found</li>
                            )
                        }
                    </ul>,
                    document.body
                )
            }
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}
