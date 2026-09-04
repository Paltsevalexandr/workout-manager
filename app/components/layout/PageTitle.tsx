import React from "react"

type Props = {
    title:string
}

export default function PageTitle({title}: Props) {
    return (
        <section className="page-title-section">
            <div className="section-content">
                <h1 className='page-title'>
                    {title}
                </h1>
            </div>
        </section>
    )
}
