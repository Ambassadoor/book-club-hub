import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSessionManager } from "../../hooks/useSessionManager"
import { isExistingAccount, postUser } from "../../services/userServices/userServices"
import { Visibility, VisibilityOff } from "@mui/icons-material"


export const CreateAccount = ({setUser}) => {

    const [accountError, setAccountError] = useState(false)

    const [userData, setUserData] = useState({
        "firstName": "",
        "lastName": "",
        "userName": "",
        "email": "",
        "tagline": "",
        "created_at": null,
        "sso_id": null,
        "picture": "",
        "method": "",
        "password": ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const {signIn} = useSessionManager()
    const navigate = useNavigate()

    type RequiredUserDataKeys = "firstName" | "lastName" | "userName" | "email" | "password";

    const checkRequired = () => {
        const keys: RequiredUserDataKeys[] = [
            "firstName", "lastName", "userName", "email", "password"
        ]

        let disabled = false
        keys.forEach(key => {
            if (userData[key].length === 0) {
                disabled = true
            }
            if (userData.password.length < 8) {
                disabled = true
            }
        })
        setDisabled(disabled)
    }

    const updateUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name
        if (key === "email") {
            setAccountError(false)
        }
        setUserData({
            ...userData, [key] : e.target.value
        })
    }

    const handleClose = () => {
        navigate("/")
    }

    const handleCreateAccount = async () => {
        const existing = await isExistingAccount(userData.email)

        if (existing) {
            setAccountError(true)
            return 
        }
        const data = {...userData, method: "bch"}
        postUser(data).then(res => res.json().then(res => signIn(res.email)).then(setUser).then(() => navigate("/profile"))).catch(error => console.error(error))
    }

    useEffect(() => {
        checkRequired()
    }, [userData])

    return (
        <Card className="flex flex-col h-fit">
            <CardHeader title="Create Account" subheader="Please enter your information below"/>
            <CardContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        type="text"
                        variant="standard"
                        onChange={updateUserData}
                        className="mr-10"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        variant="standard"
                        onChange={updateUserData}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="userName"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={updateUserData}
                        slotProps={{
                            htmlInput: {
                                maxLength: 20
                            }
                        }}
                        helperText={"Maximum of 20 characters"}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="standard"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((b) => !b)}>
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            },
                            htmlInput: {
                                minLength: 8
                            }
                        }}
                        onChange={updateUserData}
                        helperText="Password must be at least 8 characters"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={updateUserData}
                        error={accountError}
                        helperText={accountError ? "An account for this email already exists" : " "}
                        sx={{
                            "& input:-webkit-autofill": {
                                WebkitTextFillColor: "none !important",
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="tagline"
                        label="Tagline"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        onChange={updateUserData}
                        slotProps={{
                            htmlInput: {
                                maxLength: 200
                            }
                        }}
                        helperText="Max length of 200 characters"
                    />
                    <TextField
                        margin="dense"
                        name="picture"
                        label="Profile Picture"
                        type="url"
                        fullWidth
                        variant="standard"
                        onChange={updateUserData}
                        helperText="A url of an image"
                    />
            </CardContent>
            <CardActions className="ml-auto">
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={handleCreateAccount} color="primary" disabled={disabled}>Create Account</Button>
            </CardActions>
        </Card>
    )
}