import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import { SignUpButton } from "../profile/SignUpButton"
import { CreateAccountForm } from "./CreateAccountForm"

type CreateAccountDialogProps = {
    setUser: React.Dispatch<React.SetStateAction<number | null>>
}

export const CreateAccountDialog = ({setUser}: CreateAccountDialogProps) => {
    const [openOne, setOpenOne] = useState(false)
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
        <Button onClick={() => setOpenOne(true)}>Create Account</Button>
        <Dialog open={openOne} onClose={() => setOpenOne(false)}>
            <DialogTitle>Create Account</DialogTitle>
            <DialogContent>
                <SignUpButton method="signup" handleClose={handleClose} setUser={setUser}/>
                <Button onClick={() => setOpen(true)}>Create Account with BCH</Button>
            </DialogContent>
        </Dialog>
        <CreateAccountForm setUser={setUser} open={open} setOpen={setOpen} setOpenOne={setOpenOne}/>
        </>
    )
}