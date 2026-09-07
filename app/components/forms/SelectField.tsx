type Props<Value extends string | number> = {
    label: string;
    name: string;
    value: Value;
    options: readonly Value[];
    onChange: (value: Value) => void;
    optionsNames?: readonly string[];
    parseValue?: (value: string) => Value;
    formatOption?: (value: Value | string) => string;
}
import { capitalize } from "../../lib"

export default function SelectField<Value extends string | number>({
    label,
    name,
    value,
    options,
    onChange,
    optionsNames = options.map(String),
    parseValue = (option) => option as Value,
    formatOption = (option) => capitalize(String(option)),
}: Props<Value>) {
    return (
        <label>
            {label}
            <select
                value={String(value)}
                onChange={(event) => onChange(parseValue(event.target.value))}
                name={name}
            >
                {options.map((option, index) => (
                    <option key={String(option)} value={String(option)}>
                        {formatOption(optionsNames[index])}
                    </option>
                ))}
            </select>
        </label>
    )
}
