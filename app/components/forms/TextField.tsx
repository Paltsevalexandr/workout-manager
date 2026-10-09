import { KeyboardEvent } from 'react';

type Props = {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    autoFocus?: boolean;
    autoComplete?: string;
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export default function TextField({
    label,
    name,
    value,
    required = false,
    autoFocus = false,
    autoComplete,
    placeholder,
    className,
    onChange,
    onFocus,
    onKeyDown,
}: Props) {
    return (
        <label>
            {label}
            <input
                className={className}
                name={name}
                required={required}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
            />
        </label>
    )
}
