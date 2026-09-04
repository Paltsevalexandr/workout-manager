type Props = {
    label: string;
    value: string;
    required?: boolean;
    autoFocus?: boolean;
    onChange: (value: string) => void;
}

export default function TextField({
    label,
    value,
    required = false,
    autoFocus = false,
    onChange,
}: Props) {
    return (
        <label>
            {label}
            <input
                required={required}
                autoFocus={autoFocus}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    )
}
