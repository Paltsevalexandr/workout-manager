type Props = {
    label: string;
    value: string;
    required?: boolean;
    onChange: (value: string) => void;
}

export default function TextField({
    label,
    value,
    required = false,
    onChange,
}: Props) {
    return (
        <label>
            {label}
            <input
                required={required}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    )
}
