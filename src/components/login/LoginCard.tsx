import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, TextField } from "@mui/material"
import { PasswordField } from "../shared/PasswordField"
import { SignUpButton } from "../profile/SignUpButton"

type LoginCardProps = {
    setUser: React.Dispatch<React.SetStateAction<number | null>>
}

export const LoginCard = ({setUser}: LoginCardProps) => {


    return (
            <Card className="md: max-w-200 self-center">
                <CardHeader
                title="Welcome to Book Club Hub!"
                />
                <CardContent>
                    <TextField label="Username" fullWidth></TextField>
                    <PasswordField fullWidth/>
                </CardContent>
                    <Box className="flex flex-col pt-0 p-4">
                        <CardActions className="ml-auto">
                            <Button variant="contained">Sign In</Button>
                        </CardActions>
                        <CardActions className="self-center">
                            <Button>Create Account</Button>
                        </CardActions>
                        <CardActions className="self-center">
                            <SignUpButton method="signin" setUser={setUser}/>
                        </CardActions>
                    </Box>
            </Card>
    )
}