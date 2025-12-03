import { Dialog } from "@mui/material"
import { Login } from "./Login"

type LoginDialogProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginDialog = ({open, setOpen}: LoginDialogProps) => {

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
            <Login />
        </Dialog>
    )
}