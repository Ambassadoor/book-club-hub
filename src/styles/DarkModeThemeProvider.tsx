import { useColorScheme } from "@mui/material"
import { useEffect } from "react"


type Props = {
    children: React.ReactNode;
}

// Handles dark mode.
//TODO: Move to a Dark Mode Toggle Component and replace the NavBar toggle button; stop using as wrapper
export const DarkModeManager: React.FC<Props> = ({children}) => {
    const {mode, setMode} = useColorScheme()

    useEffect(() => {
        const isDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches
        setMode(isDark ? "dark" : "light")
        document.documentElement.classList.toggle('dark', isDark);
    },[])

    useEffect(() => {
        const isDark = mode === "dark";
        document.documentElement.classList.toggle('dark', isDark)
        console.log("Dark mode changed:", mode)
    }, [mode])

    return <>{children}</>
}