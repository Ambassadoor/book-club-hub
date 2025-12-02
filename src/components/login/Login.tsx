import { Box, Button, Icon, Typography } from "@mui/material";
import { useSessionManager } from "../../hooks/useSessionManager"
import { SignUpButton } from "../profile/SignUpButton";
import { Book, BookOutlined } from "@mui/icons-material";

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
                        w-[173.51px]
                        h-[30.667px]
                        text-nowrap
                        font-google-sans
                        hover:border-[#d2e3fc]
                        "
                        variant="outlined"
                        sx={{borderRadius: "999px", textTransform: "none", letterSpacing: "0.25px", textSizeAdjust: "100%"}}
                        startIcon={<BookOutlined/>}
                        >
                        <Typography className=" text-[14px]">Sign in with BCH</Typography>
                    </Button>
                </Box>
                <Button className="mb-5 text-black">Create Account</Button>
            </Box>
        </Box>
    )
}