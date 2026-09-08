type Props = {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    autoFocus?: boolean;
    onChange: (value: number) => void;
}

export default function DateField({
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
                name={name}
                required={required}
                autoFocus={autoFocus}
                value={value}
                type="date"
                onChange={(event) => onChange(Date.parse(event.target.value))}
            />
        </label>
    )
}
