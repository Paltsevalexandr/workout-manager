"use client";

import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TextField from './TextField';
import { X } from 'lucide-react';
import styles from "./SearchableSelect.module.scss";

type Props<T extends { name: string, id: number }> = {
    items: T[];
    name: string;
    label: string;
    selectedItem: T | null;
    queryMinLength?: number;
    setSelectedItem: Dispatch<SetStateAction<T | null>>
}

type Position = {
    top: number;
    left: number;
    width: number;
};

export default function SearchableSelect<T extends { name: string, id: number }>({
    items,
    name,
    label,
    selectedItem,
    queryMinLength = 1,
    setSelectedItem,
}: Props<T>) {
    const [query, setQuery] = useState<string>(selectedItem?.name ?? "");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [position, setPosition] = useState<Position | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    function closeDropdown() {
        setIsDropdownOpen(false);
        setQuery(selectedItem?.name ?? "");
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setQuery(selectedItem?.name ?? "");
    }, [selectedItem]);

    useLayoutEffect(() => {
        if (!isDropdownOpen || !containerRef.current) return;

        const gap = 4;
        const rect = containerRef.current.getBoundingClientRect();
        const inset = rect.width * 0.015; // тот же зазор по бокам, что и раньше был через left:1.5%/width:97%
        setPosition({
            top: rect.bottom + gap,
            left: rect.left + inset,
            width: rect.width - inset * 2
        });
    }, [isDropdownOpen]);

    useEffect(() => {
        if (!isDropdownOpen) return;

        function handleOutsideClick(e: MouseEvent) {
            const target = e.target as Node;
            const insideField = containerRef.current?.contains(target);
            const insideDropdown = dropdownRef.current?.contains(target);
            if (!insideField && !insideDropdown) {
                closeDropdown();
            }
        }
        function handleScroll() {
            closeDropdown();
        }

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isDropdownOpen, selectedItem]);

    function handleSelectItem(item: T) {
        setSelectedItem(item);
        setQuery(item.name);
        setIsDropdownOpen(false);
    }

    function clearSelection() {
        setSelectedItem(null);
        setQuery("");
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    const showDropdown = isDropdownOpen && query.length >= queryMinLength;

    return (
        <div ref={containerRef} className={styles.searchableSelect}>
            <div className={styles.fieldWrap}>
                <TextField
                    name={name}
                    label={label}
                    value={query}
                    autoComplete="off"
                    className={selectedItem ? styles.searchInput : ""}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={setQuery}
                />
                {
                    selectedItem &&
                    <button className={styles.clearSelection}
                        type="button"
                        aria-label={`Clear ${selectedItem.name}`}
                        onClick={clearSelection}>
                        <X size={16} />
                    </button>
                }
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
                                            {item.name}
                                        </button>
                                    </li>
                                )
                            })
                        }
                        {
                            !filteredItems.length &&
                            <li className={styles.foundItemEmpty}>Not Found</li>
                        }
                    </ul>,
                    document.body
                )
            }
        </div>
    )
}
