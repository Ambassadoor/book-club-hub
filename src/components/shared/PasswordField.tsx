import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { useState } from "react"

type PasswordFieldProps = {
    value: string,
    required?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PasswordField = (props: PasswordFieldProps) => {
    const [ showPassword, setShowPassword] = useState(false)
    const {value, required, onChange} = props

    return (
        <TextField
        required={required || false}
        margin="dense"
        name="password"
        label="Password"
        value={value}
        type={showPassword ? "text" : "password"}
        fullWidth
        variant="standard"
        slotProps={{
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(b => !b) }>
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                )
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