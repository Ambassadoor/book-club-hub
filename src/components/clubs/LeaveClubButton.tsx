import { Button } from "@mui/material"

type LeaveClubButtonProps = {
    userId: number,
    clubId: number,
    handleLeave: React.Dispatch<React.SetStateAction<string>>
}

// Handles logic for leaving club
export const LeaveClubButton = ({userId, clubId, handleLeave}: LeaveClubButtonProps) => {
    
    const handleLeaveClick = async () => {
        const clubMember = await fetch(`http://localhost:8088/clubMembers?userId=${userId}&clubId=${clubId}`).
        then(res => res.json())
        const response = await fetch(`http://localhost:8088/clubMembers/${clubMember[0].id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isActive: false
            })
        }).then(res => res.json()).catch(console.error)
        console.log(response)
        handleLeave("guest")
    }

    return (
        <Button variant="contained" color="warning" onClick={handleLeaveClick}>Leave Club</Button>
    )
}