import React from 'react'

type Props = {
    title:string
}

export default function PageTitle({title}: Props) {
    return (
        <h1 className='page-title'>
            {title}
        </h1>
    )
}
