import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { SignUpButton } from "../profile/SignUpButton";
import { BookOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { bchSignIn } from "../../services/userServices/userServices";
import { useSessionManager } from "../../hooks/useSessionManager";

type LoginProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setUser: React.Dispatch<React.SetStateAction<number | null>>
}

export const Login = ({open, setOpen, setUser}:LoginProps) => {
    const [signInOpen, setSignInOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState<string>();
    // For demo purposes only: NEVER STORE REAL PASSWORDS IN STATE
    const [password, setPassword] = useState<string>();
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [googleSignIn, setGoogleSignIn] = useState(false)
    const {signIn} = useSessionManager();

    const handleClose = () => {
        setOpen(false)
    }

    const handleClickSignInOpen = () => {
        setSignInOpen(true)
    }

    const handleSignInClose = () => {
        setSignInOpen(false)
    }

    const handleSignIn = async () => {
        if (email && password) {
            setEmailError(false)
            setPasswordError(false)
            setErrorMessage("")

            try {
                const user = await bchSignIn({email: email, password: password})
                signIn(user.email).then((res) => {
                    setUser(res)
                    setOpen(false)
                })

            } catch (error: any) {
                setErrorMessage(error.message)
                if (error.name === "EmailError") {
                    setEmailError(true)
                } else if (error.name === "MethodError") {
                    handleSignInClose()
                    setGoogleSignIn(true)                    
                } else {
                    setPasswordError(true)
                }
            }
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box className="flex justify-center items-center flex-1 max-h-3/4">
                <Box className="flex flex-col border border-neutral-200 rounded-lg px-5 bg-neutral-50">
                    <Box className="pt-5 flex justify-center">
                        <Typography>Choose your sign in method</Typography>
                    </Box>
                    <Box className="flex flex-col justify-center mb-5">
                            <SignUpButton method="signin" handleClose={handleClose} setUser={setUser}/>
                        <Alert className="border-primary rounded-[999px]" variant="outlined" hidden={googleSignIn ? false : true} severity="info" onClose={() => {setGoogleSignIn(false)}}>Please Sign in with Google</Alert>
                    </Box>
                    <Box className="
                        flex
                        justify-center
                        shrink-0
                        mb-15
                    ">
                        {/* {TODO: Need to add click logic} */}
                        <Button
                            className="
                            border-[#dadce0]
                            bg-white
                            border
                            text-black
                            w-[173.51px]
                            h-[30.667px]
                            text-nowrap
                            font-google-sans
                            hover:border-[#d2e3fc]
                            "
                            variant="outlined"
                            sx={{borderRadius: "999px", textTransform: "none", letterSpacing: "0.25px", textSizeAdjust: "100%"}}
                            startIcon={<BookOutlined/>}
                            onClick={handleClickSignInOpen}
                            >
                            <Typography className=" text-[14px]">Sign in with BCH</Typography>
                        </Button>
                        <Dialog open={signInOpen} onClose={handleSignInClose}>
                            <DialogTitle>Sign in to BCH</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter your username and password.
                                </DialogContentText>
                                <Box>
                                    <TextField 
                                        error={emailError ? true : false}
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="email"
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => {setEmail(e.target.value)}}
                                        helperText={emailError && errorMessage}
                                    />
                                    <TextField
                                        error={passwordError ? true : false}
                                        required   
                                        margin="dense"
                                        id="password"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        variant="standard"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword((b) => !b)}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                        onChange={(e) => setPassword(e.target.value)}
                                        helperText={passwordError && errorMessage}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleSignInClose} className="text-accent">Cancel</Button>
                                <Button variant="contained" onClick={handleSignIn}className="bg-primary" disabled={!email || !password ? true : false}>
                                    Sign In
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                    <Box className="flex justify-center">
                        <Button className="mb-5 text-black rounded-[999px] w-[173.51px] ">Create Account</Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    )
}