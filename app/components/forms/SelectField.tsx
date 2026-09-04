type Props<Value extends string> = {
    label: string;
    value: Value;
    options: readonly Value[];
    onChange: (value: Value) => void;
    formatOption?: (value: Value) => string;
}
import { capitalize } from "../../lib"

export default function SelectField<Value extends string>({
    label,
    value,
    options,
    onChange,
    formatOption = capitalize,
}: Props<Value>) {
    return (
        <label>
            {label}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value as Value)}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {formatOption(option)}
                    </option>
                ))}
            </select>
        </label>
    )
}
