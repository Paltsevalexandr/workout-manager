import React from 'react'

type Props = {
    label: string;
    name: string;
    value: number;
    min?: number;
    required?: boolean;
    autoFocus?: boolean;
    className?: string;
    onChange: (value: number) => void;
}

export default function NumberField({
    label,
    name,
    value,
    min = 0,
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
                min={min}
                required={required}
                autoFocus={autoFocus}
                value={value}
                onChange={(event) => onChange(Math.max(min, Number(event.target.value)))}
            />
        </label>
    )
}

