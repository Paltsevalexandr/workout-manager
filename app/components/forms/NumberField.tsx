import React from 'react'

type Props = {
    label: string;
    name: string;
    value: number;
    required?: boolean;
    autoFocus?: boolean;
    onChange: (value: number) => void;
}

export default function NumberField({
    label,
    name,
    value,
    required = false,
    autoFocus = false,
    onChange,
}: Props) {
    return (
        <label>
            {label}
            <input
                type="number"
                name={name}
                required={required}
                autoFocus={autoFocus}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
            />
        </label>
    )
}

