import { Box, Button, Typography } from "@mui/material";
import { useSessionManager } from "../../hooks/useSessionManager"
import { SignUpButton } from "../profile/SignUpButton";

export const Login = () => {
    const { signIn, getCurrentUserId } = useSessionManager();



    return (
        <Box className="flex justify-center items-center flex-1 max-h-3/4">
            <Box className="flex flex-col border border-neutral-200 rounded-lg px-5 bg-neutral-50">
                <Box className="pt-5 flex justify-center">
                    <Typography>Choose your sign in method</Typography>
                </Box>
                <SignUpButton/>
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
                        text-[14px]
                        font-normal
                        min-w-[224.938px]
                        h-[38.8571]
                        text-nowrap
                        font-google-sans
                        hover:border-[#d2e3fc]
                        "
                        variant="outlined"
                        sx={{borderRadius: "999px"}}
                        >
                        Sign in with BCH
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}