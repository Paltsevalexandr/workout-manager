import styles from "./CheckboxField.module.scss"

type Props = {
    label: string;
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function CheckboxField({
    label,
    name,
    checked,
    onChange,
}: Props) {
    return (
        <label className={styles.checkboxLabel}>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            {label}
        </label>
    )
}
