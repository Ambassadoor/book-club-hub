import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { useState } from "react"

type PasswordFieldProps = {
    className?: string
    fullWidth?: boolean
    value: string,
    required?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PasswordField = (props: PasswordFieldProps) => {
    const [ showPassword, setShowPassword] = useState(false)
    const {className, fullWidth=false, value, required, onChange} = props

    return (
        <TextField
        className={className}
        required={required || false}
        margin="dense"
        name="password"
        label="Password"
        value={value}
        type={showPassword ? "text" : "password"}
        fullWidth={fullWidth}
        variant="standard"
        slotProps={{
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(b => !b) }>
                            {showPassword ? <VisibilityOff color="secondary"/> : <Visibility color="secondary"/>}
                        </IconButton>
                    </InputAdornment>
                ),
                className: "text-black"
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