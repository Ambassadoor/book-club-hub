import { TextField, Typography } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"

type ToggleFieldProps = {
    fullWidth?: boolean,
    multiline?: boolean,
    rows?: number,
    name: string,
    editing: boolean,
    value: string,
    label: string,
    type?: string | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToggleField = (props: ToggleFieldProps) => {
    const {fullWidth=false, multiline=false, rows, name, editing, value, label, type, onChange} = props

    return (
        type==="password" && editing ? <PasswordField fullWidth={fullWidth} value={value} onChange={onChange}/> :
        editing ? <TextField fullWidth={fullWidth} multiline={multiline} rows={rows && rows} slotProps={{
            input: {className: "text-black"}
        }} name={name} type={type? type: "text"} label={label} value={value} variant="standard" onChange={onChange}></TextField> : <Typography>{`${value}`}</Typography>

    )
}