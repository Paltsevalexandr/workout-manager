"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname()
    // sections lists extra path prefixes that belong to the item,
    // e.g. /workouts/1/history is part of "Workouts" whose href is "/"
    const menuItems = [
        { text: "Workouts", href: "/", sections: ["/workouts"] },
        { text: "Exercises", href: "/exercises", sections: ["/exercises"] },
    ]

    function isInSection(prefix: string) {
        return pathname === prefix || pathname.startsWith(prefix + "/");
    }
    return (
        <header>
            <nav>
                <ul>
                    {
                        menuItems.map((item) => {
                            const isCurrentPage = item.href === pathname;
                            const isActive = isCurrentPage || item.sections.some(isInSection);
                            return (
                                <li key={item.text}>
                                    <Link
                                        href={item.href}
                                        className={isActive ? "active" : ""}
                                        // "page" for the exact page, "true" for its subpages
                                        aria-current={isCurrentPage ? "page" : isActive ? "true" : undefined}
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
