import { TextField, Typography } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"

type ToggleFieldProps = {
    name: string,
    editing: boolean,
    value: string,
    label: string,
    type?: string | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToggleField = (props: ToggleFieldProps) => {
    const {name, editing, value, label, type, onChange} = props

    return (
        type==="password" && editing ? <PasswordField value={value} onChange={onChange}/> :
        editing ? <TextField slotProps={{
            input: {className: "text-black"}
        }} name={name} type={type? type: "text"} label={label} value={value} variant="standard" onChange={onChange}></TextField> : <Typography>{`${label}: ${value}`}</Typography>

    )
}