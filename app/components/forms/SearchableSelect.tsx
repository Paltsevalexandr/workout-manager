"use client";

import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TextField from './TextField';
import { X } from 'lucide-react';
import styles from "./SearchableSelect.module.scss";
import dropdownStyles from "./SearchableDropdown.module.scss";
import { capitalize } from '@/lib';

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

// Text shown in the input for the selected item
function getItemLabel(item: { name: string } | null) {
    return item ? capitalize(item.name) : "";
}

export default function SearchableSelect<T extends { name: string, id: number }>({
    items,
    name,
    label,
    selectedItem,
    queryMinLength = 0,
    setSelectedItem,
}: Props<T>) {
    const [query, setQuery] = useState<string>(getItemLabel(selectedItem));
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [position, setPosition] = useState<Position | null>(null);
    // Index of the item highlighted via keyboard/mouse, -1 means none
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    function closeDropdown() {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
        setQuery(getItemLabel(selectedItem));
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setQuery(getItemLabel(selectedItem));
    }, [selectedItem]);

    useLayoutEffect(() => {
        if (!isDropdownOpen || !containerRef.current) return;

        const gap = 1;
        const rect = containerRef.current.getBoundingClientRect();
        const inset = rect.width * 0.015; // same side gap as the old left:1.5%/width:97% CSS
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
        function handleScroll(e: Event) {
            // Ignore scrolling inside the dropdown list itself
            if (dropdownRef.current?.contains(e.target as Node)) return;
            closeDropdown();
        }
        function handleResize() {
            closeDropdown();
        }

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isDropdownOpen, selectedItem]);

    function handleSelectItem(item: T) {
        setSelectedItem(item);
        setQuery(getItemLabel(item));
        setActiveIndex(-1);
        setIsDropdownOpen(false);
    }

    function clearSelection() {
        setSelectedItem(null);
        setQuery("");
    }

    function handleQueryChange(value: string) {
        setQuery(value);
        setActiveIndex(-1);
        setIsDropdownOpen(true);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        switch (e.key) {
            case "ArrowDown":
                if (!showDropdown || !filteredItems.length) return;
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredItems.length);
                break;
            case "ArrowUp":
                if (!showDropdown || !filteredItems.length) return;
                e.preventDefault();
                setActiveIndex(prev => (prev <= 0 ? filteredItems.length - 1 : prev - 1));
                break;
            case "Enter": {
                if (!showDropdown) return;
                // Don't submit the parent form while the dropdown is open
                e.preventDefault();
                const activeItem = filteredItems[activeIndex];
                if (activeItem) handleSelectItem(activeItem);
                break;
            }
            case "Escape":
                closeDropdown();
                break;
        }
    }

    const filteredItems = items
        .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    const showDropdown = isDropdownOpen && query.length >= queryMinLength;

    // Keep the highlighted item visible when navigating with arrows
    useEffect(() => {
        if (activeIndex < 0 || !dropdownRef.current) return;
        const activeElement = dropdownRef.current.children[activeIndex] as HTMLElement | undefined;
        activeElement?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

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
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    placeholder={"Search..."}
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
                        className={dropdownStyles.foundItems}
                        style={{ top: position.top, left: position.left, width: position.width }}>
                        {
                            filteredItems.map((item, index) => {
                                return (
                                    <li key={name + "_filtered_" + item.id}
                                        className={`${dropdownStyles.foundItem} ${index === activeIndex ? dropdownStyles.foundItemActive : ""}`}
                                        onMouseEnter={() => setActiveIndex(index)}>
                                        <button type="button"
                                            tabIndex={-1}
                                            onClick={() => handleSelectItem(item)}>
                                            {capitalize(item.name)}
                                        </button>
                                    </li>
                                )
                            })
                        }
                        {
                            !filteredItems.length &&
                            <li className={dropdownStyles.foundItemEmpty}>Not Found</li>
                        }
                    </ul>,
                    document.body
                )
            }
        </div>
    )
}
