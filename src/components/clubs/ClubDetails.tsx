import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const ClubDetails = () => {
    const [clubInfo, setClubInfo] = useState(null)
    const {clubId} = useParams()

    useEffect(() => {
        fetch(`http://localhost:8088/clubs/${clubId}`).then(res => res.json()).then(setClubInfo).catch(error => console.error(error))
    }, [clubId])

    return (
        clubInfo &&
        <Box>
            <Typography>{clubInfo.name}</Typography>
            <Typography>{clubInfo.description}</Typography>

        </Box>
    )
}