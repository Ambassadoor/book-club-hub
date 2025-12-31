import { TextField, Typography, type FilledTextFieldProps, type StandardTextFieldProps, type OutlinedTextFieldProps, type TypographyProps } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"

export type ToggleFieldProps = {
    editing: boolean
    textProps?: (FilledTextFieldProps | StandardTextFieldProps | OutlinedTextFieldProps)
    typeProps?: TypographyProps
}




// A custom field that switches between a TextField and a Typography. For quick edit forms. 
export const ToggleField = ({editing, textProps, typeProps}: ToggleFieldProps) => {

    return (
        textProps?.type==="password" && editing ? (
            <PasswordField
                {...textProps}
            />
        ) : editing ? (
            <TextField 
                {...textProps}
            />
        ) : (
            <Typography
                {...typeProps}
            >
                {`${textProps?.label}: ${textProps?.value}`}
            </Typography>
        )
    )
}