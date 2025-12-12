import { Button } from "@mui/material"

type JoinClubButtonProps = {
    userId: number
    clubId: number
    handleJoin: React.Dispatch<React.SetStateAction<string>>
}
export const JoinClubButton = ({userId, clubId, handleJoin}: JoinClubButtonProps) => {

    const handleJoinClick = async () => {
        const response = await fetch(`http://localhost:8088/clubMembers?clubId=${clubId}&userId=${userId}`).then(res => res.json())

        if (response.length > 0) {
            fetch(`http://localhost:8088/clubMembers/${response[0].id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isActive: true
                })
            }).then(() => {
                handleJoin("member")
            }).catch(console.error)
        } else {

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
        }).then(res => res.json()).then(() => handleJoin("member")).catch(error => console.error(error))}
        
    }

    return (
        <Button variant="contained" onClick={handleJoinClick}>
            Join
        </Button>
    )
}