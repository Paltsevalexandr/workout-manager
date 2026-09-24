import React from "react"

type Props = {}

export default function Footer({ }: Props) {
    return (
        <footer>
            <div className="section-content">
                <p>Workout Manager · made with Next.js</p>
                <a href="https://github.com/Paltsevalexandr/workout-manager"
                    rel="noopener noreferrer"
                    target="_blank">
                    View source on GitHub
                </a>
            </div>
        </footer>
    )
}
