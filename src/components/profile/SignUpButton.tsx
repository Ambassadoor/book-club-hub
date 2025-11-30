import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import {jwtDecode, type JwtPayload} from "jwt-decode"
import { postUser } from "../../services/userServices/userServices"
import { useNavigate } from "react-router-dom"

export const SignUpButton = () => {
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const navigate = useNavigate()

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
                context: "signup",
                nonce: "",
                auto_prompt: "false",
                callback: (response: GoogleCredentialResponse) => {
                    const  decoded: GoogleJWT = jwtDecode(response.credential)
                    if (
                      decoded.iss !== "https://accounts.google.com" ||
                    decoded.aud !== clientId ||
                    Date.now() / 1000 > decoded.exp ||
                    Date.now() / 1000 < decoded.nbf
                    ) {
                        throw new Error("Invalid sign up request")
                    } else {
                    
                    
                    postUser({
                        method: "google",
                        ...decoded,


                    })
                }
                },
                ux_mode: "popup",
            } as GoogleAccountsIdInitializeConfig);
            window.google.accounts.id.renderButton(
                document.getElementById("g_id_signin"),
                { 
                    type: "standard",
                    shape: "pill",
                    theme: "outline",
                    text: "signup_with",
                    size: "large",
                    logo_alignment: "left"
                }
            )
        }
    },[googleLoaded, clientId])
    
    return (
        <Box className="flex justify-center my-5">
            <div id="g_id_signin"></div>
        </Box>
    )
}