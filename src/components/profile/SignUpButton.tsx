import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import {jwtDecode, type JwtPayload} from "jwt-decode"
import { isExistingAccount, postUser } from "../../services/userServices/userServices"
import { useSessionManager } from "../../hooks/useSessionManager"

type SignUpButtonProps = {
    method: string;
    handleClose: () => void
    setUser: React.Dispatch<React.SetStateAction<number | null>>,
    setGoogleSignIn?: React.Dispatch<React.SetStateAction<boolean>>,
}

//Renders a google button for either sign in or sign up
export const SignUpButton = ({method, handleClose, setUser, setGoogleSignIn}: SignUpButtonProps)=> {
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const { signIn } = useSessionManager()
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Adds eventlistener to check that google has loaded
    useEffect(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            setGoogleLoaded(true);
        } else {
            const script = document.querySelector('script[src*="gsi/client"]');
            if (script) {
                script.addEventListener("load", () => setGoogleLoaded(true))
            }
        }
    }, [])

    // Renders the login button when google loads
    useEffect(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            interface GoogleCredentialResponse {
                credential: string;
                select_by?: string;
            }

            interface GoogleAccountsIdInitializeConfig {
                client_id: string;
                context?: string;
                nonce?: string;
                auto_prompt?: string;
                callback: (response: GoogleCredentialResponse) => void;
                ux_mode?: string;
            }

            interface GoogleJWT extends JwtPayload {
                iss: string,
                azp: string,
                aud: string,
                sub: string,
                email: string,
                email_verified: boolean,
                nbf: number,
                name: string,
                picture: string,
                given_name: string,
                family_name: string,
                iat: number,
                exp: number,
                jti: string,
            }

            window.google.accounts.id.initialize({
                client_id: clientId,
                context: method,
                nonce: "",
                auto_prompt: "false",
                callback: async (response: GoogleCredentialResponse) => {
                    const  decoded: GoogleJWT = jwtDecode(response.credential)
                    const existing = await isExistingAccount(decoded.email)
                    if (
                      decoded.iss !== "https://accounts.google.com" ||
                    decoded.aud !== clientId ||
                    Date.now() / 1000 > decoded.exp ||
                    Date.now() / 1000 < decoded.nbf
                    ) {
                        throw new Error("Invalid sign up request")
                    }     

                    if (method === "signup" && !existing) {          
                    postUser({
                        method: "google",
                        ...decoded,
                    }).then(() => {
                        signIn(decoded.email).then(setUser).then(() => handleClose())
                    }).catch(res => {
                        console.error(res)
                    })
                    } else if (method === "signin" || existing) {
                        signIn(decoded.email).then((res) => {
                            setUser(res)
                            handleClose()
                        }).catch(res => {
                            console.error(res)
                        })
                    }
                
                },
                ux_mode: "popup",
            } as GoogleAccountsIdInitializeConfig);
            window.google.accounts.id.renderButton(
                document.getElementById(`g_id_${method}`),
                { 
                    type: "standard",
                    shape: "pill",
                    theme: "outline",
                    text: `${method}_with`,
                    size: "medium",
                    logo_alignment: "left",
                }
            )
        }
    },[googleLoaded, clientId])
    
    return (
        <Box className="flex justify-center my-5">
            <div id={`g_id_${method}`}></div>
        </Box>
    )
}