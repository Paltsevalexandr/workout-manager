import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Ellipsis } from 'lucide-react';
import Dropdown from './Dropdown';
import styles from './KebabMenu.module.scss';

type MenuItem = {
    label: string;
    onClick?: () => void;
    href?: string;
};

type Props = {
    items: MenuItem[];
}

export default function KebabMenu({ items }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleOutsideClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isOpen]);

    return (
        <div ref={menuRef} className={styles.wrap}>
            <button className={`button-secondary ${styles.trigger}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(prev => !prev);
                }}>
                <Ellipsis size={16} />
            </button>
            <div className={styles.dropdownPosition}>
                <Dropdown isExpanded={isOpen}>
                    <ul className={styles.menu}>
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
            </div>
        </div>
    )
}
