type Props = {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    autoFocus?: boolean;
    onChange: (value: string) => void;
    onFocus?: () => void;
}

export default function TextField({
    label,
    name,
    value,
    required = false,
    autoFocus = false,
    onChange,
    onFocus,
}: Props) {
    return (
        <label>
            {label}
            <input
                name={name}
                required={required}
                autoFocus={autoFocus}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onFocus={onFocus}
            />
        </label>
    )
}
