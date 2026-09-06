import React from 'react'

type Props = {
    label: string;
    name: string;
    value: number;
    required?: boolean;
    autoFocus?: boolean;
    className?: string;
    onChange: (value: number) => void;
}

export default function NumberField({
    label,
    name,
    value,
    required = false,
    autoFocus = false,
    className = "",
    onChange,
}: Props) {
    return (
        <label>
            {label}
            <input
                className={className}
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

