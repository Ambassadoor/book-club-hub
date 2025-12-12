import { TextField, Typography } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"

type ToggleFieldProps = {
    variant?: string,
    fullWidth?: boolean,
    multiline?: boolean,
    className?: string,
    rows?: number,
    name: string,
    editing: boolean,
    value: string,
    label: string,
    type?: string | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToggleField = (props: ToggleFieldProps) => {
    const {variant, fullWidth=false, multiline=false, className, rows, name, editing, value, label, type, onChange} = props

    return (
        type==="password" && editing ? <PasswordField className={className} fullWidth={fullWidth} value={value} onChange={onChange}/> :
        editing ? <TextField className={className} fullWidth={fullWidth} multiline={multiline} rows={rows && rows} slotProps={{
            input: {className: "text-black"}
        }} name={name} type={type? type: "text"} label={label} value={value} variant="standard" onChange={onChange}></TextField> : <Typography variant={variant} className={className}>{`${value}`}</Typography>

    )
}