import { useEffect, useState } from "react";
import { dateStringToDateObj, getFormattedDate } from "@/lib";

type Props = {
    label: string;
    name: string;
    value: string;
    max?: number | null;
    required?: boolean;
    autoFocus?: boolean;
    onChange: (value: number) => void;
}

// Years below this are intermediate states while the user types the year digit by digit
const MIN_COMPLETE_YEAR = 1000;
// Earliest date that makes sense for a workout log
const MIN_DATE = "2000-01-01";

export default function DateField({
    label,
    name,
    value,
    max = null,
    required = false,
    autoFocus = false,
    onChange,
}: Props) {
    // Raw input value, so typing isn't interrupted by re-rendering
    // with an incomplete date (e.g. year "0002")
    const [draft, setDraft] = useState<string>(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    function handleChange(rawValue: string) {
        setDraft(rawValue);

        // Cleared or incomplete date: keep the draft, don't report it upwards
        if (!rawValue) return;
        const localDate = dateStringToDateObj(rawValue);
        if (isNaN(localDate.getTime()) || localDate.getFullYear() < MIN_COMPLETE_YEAR) return;

        const minDate = dateStringToDateObj(MIN_DATE);
        if (localDate < minDate) {
            setDraft(MIN_DATE);
            onChange(minDate.getTime());
            return;
        }
        if (max !== null) {
            const maxDate = dateStringToDateObj(getFormattedDate(max));
            if (maxDate < localDate) {
                setDraft(getFormattedDate(max));
                onChange(maxDate.getTime());
                return;
            }
        }
        onChange(localDate.getTime());
    }

    return (
        <label>
            {label}
            <input
                name={name}
                required={required}
                autoFocus={autoFocus}
                value={draft}
                type="date"
                min={MIN_DATE}
                max={max !== null ? getFormattedDate(max) : undefined}
                onChange={(event) => handleChange(event.target.value)}
                // Drop an unfinished draft and show the last valid date again
                onBlur={() => setDraft(value)}
            />
        </label>
    )
}
