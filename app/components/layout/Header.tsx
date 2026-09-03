'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()
    const menuItems = [
        { text: 'Exercises', href: '/exercises' },
        { text: 'Menu item 2', href: '#' },
        { text: 'Menu item 3', href: '#' },
        { text: 'Menu item 4', href: '#' },
    ]
    return (
        <header>
            <nav>
                <ul>
                    {
                        menuItems.map((item) => {
                            return (
                                <li key={item.text}>
                                    <Link
                                        href={item.href}
                                        className={item.href === pathname ? 'active' : ''}
                                        aria-current={item.href === pathname ? 'page' : undefined}
                                    >
                                        {item.text}
                                    </Link>
                                </li>
                            )
                        })
                    }
                    
                </ul>
            </nav>
        </header>
    )
}
