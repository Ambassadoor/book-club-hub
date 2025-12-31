import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material"
import { useState } from "react"



// A reusable password input field
export const PasswordField = ({...props}: TextFieldProps) => {
    const [ showPassword, setShowPassword] = useState(false)

    return (
        <TextField
        helperText={
            props.error
            ? "Incorrect Password"
            : " "
        }
        type={showPassword ? "text" : "password"}
        slotProps={{
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(b => !b) }>
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                ),
            }
        }}
        onKeyDown={e => {
            if (e.key === " ") {
                e.preventDefault();
            }
        }}
        {...props}
        />
    )
}