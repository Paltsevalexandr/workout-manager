import styles from "./CheckboxField.module.scss"

type Props = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function CheckboxField({
    label,
    checked,
    onChange,
}: Props) {
    return (
        <label className={styles.checkboxLabel}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            {label}
        </label>
    )
}
