import { TextField, Typography, type FilledTextFieldProps, type StandardTextFieldProps, type OutlinedTextFieldProps, type TypographyProps } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"

export type ToggleFieldProps = {
    editing: boolean
    noLabel?: boolean
    textProps?: (FilledTextFieldProps | StandardTextFieldProps | OutlinedTextFieldProps)
    typeProps?: TypographyProps
}




// A custom field that switches between a TextField and a Typography. For quick edit forms. 
export const ToggleField = ({editing, noLabel=false, textProps, typeProps}: ToggleFieldProps) => {
    const { type, ...otherTextProps } = textProps || {}

    return (
        type === "password" && editing ? (
            <PasswordField
                {...otherTextProps}
            />
        ) : editing ? (
            <TextField 
                {...otherTextProps}
            />
        ) : (
            <Typography
                {...typeProps}
            >
                {noLabel ? `${textProps?.value}` : `${textProps?.label}: ${textProps?.value}`}
            </Typography>
        )
    )
}