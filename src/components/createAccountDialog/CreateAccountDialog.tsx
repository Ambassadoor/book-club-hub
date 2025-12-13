import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import { SignUpButton } from "../profile/SignUpButton"
import { CreateAccountForm } from "./CreateAccountForm"

type CreateAccountDialogProps = {
    setUser: React.Dispatch<React.SetStateAction<number | null>>,
    createAccount: boolean,
    setCreateAccount: React.Dispatch<React.SetStateAction<boolean>>,
    setGoogleSignIn: React.Dispatch<React.SetStateAction<boolean>>,
    setBchExisting: React.Dispatch<React.SetStateAction<boolean>>,
}

//A Dialog to house the create account form. 
//TODO: Do we keep dialog or always route to new page? Mobile Experience?
export const CreateAccountDialog = ({setUser, createAccount, setCreateAccount, setGoogleSignIn, setBchExisting}: CreateAccountDialogProps) => {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
        setCreateAccount(false)
    }

    return (
        <>
        <Dialog open={createAccount} onClose={() => setCreateAccount(false)}>
            <DialogTitle className="self-center">Create Account</DialogTitle>
            <DialogContent>
                <SignUpButton method="signup" handleClose={handleClose} setUser={setUser} setGoogleSignIn={setGoogleSignIn}/>
                <Button onClick={() => setOpen(true)}>Create Account with BCH</Button>
            </DialogContent>
        </Dialog>
        <CreateAccountForm setUser={setUser} open={open} setOpen={setOpen} setCreateAccount={setCreateAccount} setBchExisting={setBchExisting}/>
        </>
    )
}