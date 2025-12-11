import { Box, Button, ButtonGroup, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { JoinClubButton } from "./JoinClubButton"
import { LeaveClubButton } from "./LeaveClubButton"
import { ToggleField } from "../profile/ToggleField"

type ClubDetailsProps = {
    user?: number
}

export const ClubDetails = ({user}: ClubDetailsProps) => {
    const [clubInfo, setClubInfo] = useState(null)
    const [userRole, setUserRole] = useState("guest")
    const [editing, setEditing] = useState(false)
    const {clubId} = useParams()

    //TODO: Change workflow to: Get clubMember on load, null reponse: guest, otherwise isAdmin dictates
    // Then we can pass the clubMember data to join/leave buttons, reducing fetch calls

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubInfo(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8088/clubs/${clubId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clubInfo)
        }).then(res => res.json())
        setEditing(false)
    }

    const handleEdit = () => {
        setEditing(true)
    }

    const handleCancel = () => {
        setEditing(false)
    }
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
        <Box className="flex flex-col gap-7 bg-neutral-50 rounded p-5">
            <ToggleField fullWidth name="name" editing={editing} value={clubInfo.name} label="Club Name" onChange={handleChange}/>
            <ToggleField fullWidth multiline rows={4} name="description" editing={editing} value={clubInfo.description} label="Description" onChange={handleChange}/>
            {editing && 
                <ButtonGroup className="ml-auto">
                    <Button color="warning" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Confirm</Button>
                </ButtonGroup>}
            {
            userRole === "admin"
            ? <Button hidden={editing} onClick={handleEdit}>Edit Club</Button>
            : userRole ==="guest"
            ? <JoinClubButton userId={user} clubId={clubId} handleJoin={setUserRole}/>
            : <LeaveClubButton userId={user} clubId={clubId} handleLeave={setUserRole}/>
            }

        </Box>
    )
}