import { useState } from "react";

type Props = {
    label: string;
    name: string;
    value: number;
    min?: number;
    step?: number | "any";
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
    step = 1,
    required = true,
    autoFocus = false,
    className = "",
    onChange,
}: Props) {
    // Raw input value, so the field can be cleared or hold "2." while typing
    // instead of snapping back to a number on every keystroke
    const [draft, setDraft] = useState<string>(String(value));
    const [prevValue, setPrevValue] = useState<number>(value);

    // Sync external changes (e.g. switching the session source) during render,
    // keep the draft if it already represents the same number
    if (value !== prevValue) {
        setPrevValue(value);
        if (draft === "" || Number(draft) !== value) {
            setDraft(String(value));
        }
    }

    function handleChange(rawValue: string) {
        setDraft(rawValue);
        // Empty or unparsable input: keep the draft, native `required` blocks submit
        if (rawValue === "" || isNaN(Number(rawValue))) return;
        // Out-of-range values are reported too, native `min` blocks submit
        onChange(Number(rawValue));
    }

    return (
        <label>
            {label}
            <input
                className={className}
                type="number"
                name={name}
                min={min}
                step={step}
                required={required}
                autoFocus={autoFocus}
                value={draft}
                onChange={(event) => handleChange(event.target.value)}
            />
        </label>
    )
}
