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

export default function DateField({
    label,
    name,
    value,
    max = null,
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
                max={max !== null ? getFormattedDate(max) : undefined}
                onChange={(event) => {
                    const localDate = dateStringToDateObj(event.target.value);;

                    if (max !== null) {
                        const maxDate = dateStringToDateObj(getFormattedDate(max));
                        if (maxDate < localDate) {
                            onChange(maxDate.getTime());
                            return;
                        }
                    }
                    onChange(localDate.getTime());
                }}
            />
        </label>
    )
}
