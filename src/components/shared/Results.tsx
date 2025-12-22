import { useLocation } from "react-router-dom"

export const Results = () => {
    const location = useLocation()
    const results = location.state

    console.log(results)

    return (
        <>
        
        </>
    )
}
