import { KeyboardEvent, useEffect, useRef } from "react";
import styles from "./TextField.module.scss";

type Props = {
    label: string;
    name: string;
    value: string;
    error?: string;
    required?: boolean;
    maxLength?: number;
    autoFocus?: boolean;
    autoComplete?: string;
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export default function TextField({
    label,
    name,
    value,
    error,
    required = false,
    maxLength,
    autoFocus = false,
    autoComplete,
    placeholder,
    className,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Native `required` accepts whitespace-only values, so block them
        // with a custom validity error that the browser shows on submit
        const isBlank = required && value.length > 0 && value.trim() === "";
        inputRef.current?.setCustomValidity(isBlank ? "Please fill out this field." : "");
    }, [value, required]);

    return (
        <label>
            {label}
            <input
                ref={inputRef}
                className={className}
                name={name}
                required={required}
                maxLength={maxLength}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
            />
            {error && <p className={styles.error}>{error}</p>}
        </label>
    )
}
