import { Button } from "@mui/material"

type JoinClubButtonProps = {
    userId: number
    clubId: number
    handleJoin: React.Dispatch<React.SetStateAction<string>>
}
export const JoinClubButton = ({userId, clubId, handleJoin}: JoinClubButtonProps) => {

    const handleJoinClick = async () => {
        fetch("http://localhost:8088/clubMembers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(userId),
                clubId: Number(clubId),
                isAdmin: false,
                "created_at": Date.now(),
                isActive: true,
            })
        }).then(res => res.json()).then(res => handleJoin("member")).catch(error => console.error(error))
        
    }

    return (
        <Button variant="contained" onClick={handleJoinClick}>
            Join
        </Button>
    )
}