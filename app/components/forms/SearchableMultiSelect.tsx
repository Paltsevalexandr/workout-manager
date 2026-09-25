"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import TextField from './TextField';
import { X } from 'lucide-react';
import styles from "./SearchableMultiSelect.module.scss";


type Props<T extends { name: string, id: number }> = {
    items: T[];
    name: string;
    label: string;
    selectedItems: T[];
    queryMinLength?: number;
    error?: string;
    setSelectedItems: Dispatch<SetStateAction<T[]>>
}

export default function SearchableMultiSelect<T extends { name: string, id: number }>({
    items,
    name,
    label,
    selectedItems,
    queryMinLength=1,
    error,
    setSelectedItems

}: Props<T>) {
    const [query, setQuery] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isDropdownOpen) return;

        function handleOutsideClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isDropdownOpen]);

    function deleteItem(item: T) {
        setSelectedItems(prev => prev.filter(prevItem => prevItem.id != item.id));
    }

    function handleSelectItem(item: T) {
        setSelectedItems(prev => [...prev, item]);
        setIsDropdownOpen(true); // остаёмся открытыми, чтобы можно было выбрать ещё
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
            {
                selectedItems.length > 0
                && <ul className={styles.selectedItems}>
                    {
                        selectedItems.map(item => {
                            return (
                                <li className={styles.selectedItem}
                                    key={name + "_selected_" + item.id}>
                                    {item.name}
                                    <button className={styles.selectedItemDelete}
                                        type="button"
                                        aria-label={`Remove ${item.name}`}
                                        onClick={() => deleteItem(item)}>
                                        <X size={16} />
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            }
            <div className={styles.multiSelect}>
                <TextField
                    name={name}
                    label={label}
                    value={query}
                    autoComplete="off"
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={setQuery}
                />
                {
                    showDropdown &&
                    <ul className={styles.foundItems}>
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
                            !filteredItems.length && query.length >= queryMinLength && (
                                hasMatches
                                    ? <li>All matches already added</li>
                                    : <li>Not Found</li>
                            )
                        }
                    </ul>
                }
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}
