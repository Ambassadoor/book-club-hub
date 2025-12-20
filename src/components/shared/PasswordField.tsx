import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { useState } from "react"

type PasswordFieldProps = {
    name?: string,
    className?: string
    fullWidth?: boolean
    value?: string,
    required?: boolean,
    error?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// A reusable password input field
export const PasswordField = (props: PasswordFieldProps) => {
    const [ showPassword, setShowPassword] = useState(false)
    const {name="password", className, fullWidth=false, value, required, error=false, onChange} = props

    return (
        <TextField
        error={error}
        helperText={
            error
            ? "Incorrect Password"
            : " "
        }
        className={className}
        required={required || false}
        margin="dense"
        name={name}
        label="Password"
        value={value}
        type={showPassword ? "text" : "password"}
        fullWidth={fullWidth}
        variant="outlined"
        slotProps={{
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(b => !b) }>
                            {showPassword ? <VisibilityOff color="secondary"/> : <Visibility color="secondary"/>}
                        </IconButton>
                    </InputAdornment>
                ),
                className: "text-inherit"
            }
        }}
        onChange={onChange}
        onKeyDown={e => {
            if (e.key === " ") {
                e.preventDefault();
            }
        }}
        />
    )
}