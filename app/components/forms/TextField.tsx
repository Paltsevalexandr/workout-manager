type Props = {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    autoFocus?: boolean;
    autoComplete?: string;
    className?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
}

export default function TextField({
    label,
    name,
    value,
    required = false,
    autoFocus = false,
    autoComplete,
    className,
    onChange,
    onFocus,
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
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onFocus={onFocus}
            />
        </label>
    )
}
