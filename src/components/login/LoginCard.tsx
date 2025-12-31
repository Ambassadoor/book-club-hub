import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"
import { SignUpButton } from "../profile/SignUpButton"
import { useEffect, useState } from "react"
import { bchSignIn } from "../../services/userServices/userServices"
import { useSessionManager } from "../../hooks/useSessionManager"
import { Login } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

type LoginCardProps = {
    setUser: React.Dispatch<React.SetStateAction<number | null>>
}

export const LoginCard = ({setUser}: LoginCardProps) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })    
    const [disabled, setDisabled] = useState(true);
    const [signInError, setSignInError] = useState({
        type: "",
        message: ""
    })

    const {signIn} = useSessionManager();
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name
        const value = e.target.value

        setFormData((prev) => ({
            ...prev, [key]: value
        }))

        setSignInError({
            type: "",
            message: ""
        })

    }

    const handleSubmit = async () => {
        try
        {
            const user = await bchSignIn({ email: formData.email, password: formData.password})
            signIn(user.email).then(res => {
                setUser(res)
            })
        } catch (error: any)
        {
            setSignInError({
                type: error.name,
                message: error.message
            })
        }
    }

    useEffect(() => {
        Object.values(formData).some(v => v.length === 0) || signInError.type === "EmailError" || signInError.type === "PasswordError" ? setDisabled(true) : setDisabled(false)
    },[formData, signInError])

    return (
            <Card className="self-center">
                <CardHeader
                title="Welcome to Book Club Hub!"
                />
                <CardContent className="flex flex-col" >
                    <TextField 
                        name="email"
                        label="Email" 
                        helperText={
                            signInError.type === "EmailError"
                            ? "Unable to locate account for this email."
                            : " "
                        }
                        fullWidth 
                        value={formData.email}
                        error={signInError.type === "EmailError"}
                        onChange={handleChange}
                        slotProps={{
                            formHelperText: {
                                sx: {
                                    marginRight: 0,
                                    display: "flex",
                                    width: "100%"
                                }
                            }
                        }}
                    />
                    <PasswordField 
                        name="password"
                        margin="dense"
                        label="Password"
                        fullWidth
                        value={formData.password}
                        error={signInError.type === "PasswordError"}
                        onChange={handleChange} />
                </CardContent>
                    <Box className="flex flex-col pt-0 p-4">
                        <CardActions className="ml-auto">
                            <Button variant="contained" onClick={handleSubmit} disabled={disabled}>Sign In</Button>
                        </CardActions>
                        <CardActions className="self-center">
                            <Button onClick={() => navigate("/createAccount")}>Create Account</Button>
                        </CardActions>
                        <CardActions className="flex flex-col self-center">
                            <SignUpButton method="signin" setUser={setUser}/>
                            {signInError.type === "MethodError" && 
                            <Alert className="rounded-full" variant="filled" icon={<Login/>} severity="info" onClose={() => {setSignInError({type: "", message: ""})}}>
                                Please sign in using Google
                            </Alert>}
                        </CardActions>
                    </Box>
            </Card>
    )
}