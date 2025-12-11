import { Box, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { JoinClubButton } from "./JoinClubButton"

type ClubDetailsProps = {
    user?: number
}

export const ClubDetails = ({user}: ClubDetailsProps) => {
    const [clubInfo, setClubInfo] = useState(null)
    const [userRole, setUserRole] = useState("guest")
    const {clubId} = useParams()

    useEffect(() => {
        if (user && clubId) {
            fetch(`http://localhost:8088/clubMembers?userId=${user}&clubId=${clubId}`).
            then(res => res.json()).
            then(res => {
                if (res.length > 0) {
                    res[0].isAdmin
                    ? setUserRole("admin")
                    : setUserRole("member")
                } else {
                    setUserRole("guest")
                }
            })
        }
    },[user, clubId])

    useEffect(() => {
        fetch(`http://localhost:8088/clubs/${clubId}`).then(res => res.json()).then(setClubInfo).catch(error => console.error(error))
    }, [clubId])

    return (
        clubInfo &&
        <Box>
            <Typography>{clubInfo.name}</Typography>
            <Typography>{clubInfo.description}</Typography>

            {
            userRole === "admin"
            ? <Button>Edit Club</Button>
            : userRole ==="guest"
            ? <JoinClubButton userId={user} clubId={clubId} handleJoin={setUserRole}/>
            : <Button>Leave Club</Button>
            }

        </Box>
    )
}